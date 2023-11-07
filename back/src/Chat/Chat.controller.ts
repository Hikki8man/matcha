import express, { Request, Response, NextFunction } from 'express';
import { MyRequest } from '../Types/request';
import jwtStrategy from '../Auth/jwt.strategy';
import { body, param } from 'express-validator';
import convService from './Conversation.service';
import messageService from './Message.service';
import asyncWrapper from '../Utils/asyncWrapper';
import { Message } from '../Types/Chat';
import CheckValidation from '../Utils/validations/checkValidationResult';
import SocketService from '../socket.service';
import notificationService from '../Notification/notification.service';

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
      param('id').isInt(),
      CheckValidation,
      jwtStrategy,
      this.getConvById,
    );

    this.router.post(
      this.path + '/message/create',
      body('receiver_id').isInt(),
      body('content').isString().notEmpty(),
      jwtStrategy,
      asyncWrapper(this.createMessage),
    );
  }
  /* CONVERSATION */
  createConversation = async (req: MyRequest, res: Response) => {
    const user_1: number = req.user_id!;
    const user_2: number = req.body.id;
    const conv = await convService.createConv(user_1, user_2);
    console.log('conv', conv);
    res.send(conv);
  };

  getConvById = async (req: MyRequest, res: Response) => {
    const conv = await convService.getBydId(req.params.id!);
    console.log('get conv by id', conv);
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
    messageService.sendMessage(msg);
    notificationService.sendMessageNotification(
      msg.sender_id,
      req.body.receiver_id,
      msg.conv_id,
    );
    res.end();
  };
}

export default ChatController;
