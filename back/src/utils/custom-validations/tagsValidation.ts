import { body } from '../middleware/validator/check';

export const tagsValidation = body('tags')
  .exists()
  .isArray()
  .withMessage('Tags must be an array')
  .custom((value: { id: number }[]) => {
    for (const tag of value) {
      if (!tag.id) {
        return false;
      } else if (!Number.isInteger(tag.id)) {
        return false;
      }
    }
    return true;
  });
