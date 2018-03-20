import {ISPLists} from "../HeyFaddaWebPart";
import {IPromise} from "q";

export interface IHeyFaddaProps {
  lists: IPromise<ISPLists>;
}
