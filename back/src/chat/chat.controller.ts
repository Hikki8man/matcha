import express, { Request, Response, NextFunction } from 'express';
import { MyRequest } from '../types/request';
import jwtStrategy from '../auth/jwt.strategy';
import convService from './conversation.service';
import messageService from './message.service';
import asyncWrapper from '../utils/middleware/asyncWrapper';
import { Message } from '../types/chat';
import CheckValidation from '../utils/middleware/validator/checkValidationResult';
import SocketService from '../socket.service';
import notificationService from '../notification/notification.service';
import { body, param } from '../utils/middleware/validator/check';

class ChatController {
  public path = '/chat';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      this.path + '/conversation/create',
      jwtStrategy,
      body('id').isInt(),
      CheckValidation,
      asyncWrapper(this.createConversation),
    );

    this.router.get(
      this.path + '/conversation',
      jwtStrategy,
      asyncWrapper(this.getAllConv),
    );

    this.router.get(
      this.path + '/conversation/:id',
      jwtStrategy,
      param('id').isInt(),
      CheckValidation,
      this.getConvByIdWithMessages,
    );

    this.router.post(
      this.path + '/message/create',
      jwtStrategy,
      body('receiver_id').isInt(),
      body('content').isString().notEmpty(),
      CheckValidation,
      asyncWrapper(this.createMessage),
    );
  }
  /* CONVERSATION */
  createConversation = async (req: MyRequest, res: Response) => {
    const user_1: number = req.user_id!;
    const user_2: number = req.body.id;
    const conv = await convService.createConv(user_1, user_2);
    res.send(conv);
  };

  getConvByIdWithMessages = async (req: MyRequest, res: Response) => {
    const conv = await convService.getBydIdWithMessages(req.params.id!);
    if (conv) {
      const sender_id =
        conv.user_1.id === req.user_id! ? conv.user_2.id : conv.user_1.id;
      notificationService.deleteMessagesNotif(req.user_id!, sender_id);
    }
    res.send(conv);
  };

  getAllConv = async (req: MyRequest, res: Response) => {
    console.log('getting all conv');
    const convs = await convService.getAll(req.user_id!);
    res.send(convs);
  };

  /* MESSAGE */
  createMessage = async (req: MyRequest, res: Response) => {
    const msg: Message = await messageService.create(
      req.user_id!,
      req.body.receiver_id,
      req.body.content,
    );
    SocketService.sendMessage(msg);
    notificationService.createMessageNotification(
      msg.sender_id,
      req.body.receiver_id,
      msg.conv_id,
    );
    res.end();
  };
}

export default ChatController;
