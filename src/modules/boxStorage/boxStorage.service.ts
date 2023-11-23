import { Injectable } from "@nestjs/common";
import {  } from "box-typescript-sdk-gen";

@Injectable()
export class BoxStorageService{
  constructor(private readonly dropbox: Dropbox) {
    dropbox = new Dropbox({})
  }
}
