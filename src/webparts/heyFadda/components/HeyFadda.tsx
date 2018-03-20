import * as React from 'react';
import styles from './HeyFadda.module.scss';
import { IHeyFaddaProps } from './IHeyFaddaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {ISPList, ISPLists} from "../HeyFaddaWebPart";

export interface IHeyFaddaState {
  lists: ISPList[];
}

export default class HeyFadda extends React.Component<IHeyFaddaProps, IHeyFaddaState> {
  constructor(props: IHeyFaddaProps) {
    super(props);

    this.state = {
      lists: []
    };

    props.lists.then((lists: ISPLists) => {
      this.setState({lists: lists.value});
    })
  }

  public render(): React.ReactElement<IHeyFaddaProps> {
    const items = this.state.lists.map((list: ISPList) => {
      return <li>{list.Title}</li>
    });

    return (
      <div className="mein-tolles-webpart">
        <h2>Hallo, Welt!</h2>
        <div className="mein-tolles-webpart">{items}</div>
      </div>
    );
  }
}
