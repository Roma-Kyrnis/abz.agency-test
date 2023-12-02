import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import imageSize from 'image-size';

import config from '../config';
import { PhotoValidationError } from './interfaces/photoValidationPipe.interface';

@Injectable()
export class PhotoValidationPipe implements PipeTransform {
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    try {
      if (!value.mimetype || !config.constants.PHOTO.ALLOWED_MIMETYPE_REGEXP.test(value.mimetype)) {
        throw new PhotoValidationError(
          `The photo must be ${config.constants.PHOTO.ALLOWED_IMAGE_TYPES.join(', ')} types`,
        );
      }

      if (value.size > config.constants.PHOTO.MAX_SIZE) {
        throw new PhotoValidationError(
          `The photo may not be greater than ${config.constants.PHOTO.MAX_SIZE} Mbytes.`,
        );
      }

      const image = imageSize(value.buffer);

      if (!image.width || !image.height) {
        throw new PhotoValidationError(
          `The photo must be ${config.constants.PHOTO.MIN_WIDTH}*${config.constants.PHOTO.MIN_HEIGHT}px`,
        );
      }
      if (
        image.width < config.constants.PHOTO.MIN_WIDTH ||
        image.height < config.constants.PHOTO.MIN_HEIGHT
      ) {
        throw new PhotoValidationError(
          `Minimum dimension of photo ${config.constants.PHOTO.MIN_WIDTH}x${config.constants.PHOTO.MIN_HEIGHT}px`,
        );
      }

      return value;
    } catch (error) {
      if (error instanceof PhotoValidationError) {
        throw new UnprocessableEntityException(
          {
            success: false,
            message: 'Validation failed',
            fails: { photo: [error.message] },
          },
          { cause: error },
        );
      }
      throw new UnprocessableEntityException(
        {
          success: false,
          message: 'Validation failed',
          fails: { photo: ["Please verify the photo's integrity"] },
        },
        { cause: error },
      );
    }
  }
}
