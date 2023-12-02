import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import sharp from 'sharp';

import config from '../config';

@Injectable()
export class PhotoOptimizationPipe implements PipeTransform {
  async transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    try {
      /** By default it uses "fit: cover" and center for horizontal and vertical */
      const imageSharp = await sharp(value.buffer)
        .resize(config.constants.PHOTO.AVATAR_WIDTH, config.constants.PHOTO.AVATAR_HEIGHT)
        .jpeg({
          quality: config.constants.PHOTO.AVATAR_QUALITY,
          chromaSubsampling: config.constants.PHOTO.AVATAR_CHROMA_SUBSAMPLING,
          force: true,
          mozjpeg: true,
        })
        .toFormat('jpg')
        .toBuffer({ resolveWithObject: true });

      return { ...value, buffer: imageSharp.data, size: imageSharp.info.size };
    } catch (error) {
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
