import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HeyFaddaWebPartStrings';
import HeyFadda from './components/HeyFadda';
import { IHeyFaddaProps } from './components/IHeyFaddaProps';
import MockHttpClient from './MockHttpClient';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {IPromise} from "q";

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export interface IHeyFaddaWebPartProps {
  description: string;
}

export default class HeyFaddaWebPart extends BaseClientSideWebPart<IHeyFaddaWebPartProps> {

  public render(): void {
    let lists: IPromise<ISPLists>;

    if (Environment.type === EnvironmentType.Local) {
      lists = this._getMockListData();
    }

    if (Environment.type === EnvironmentType.SharePoint || Environment.type === EnvironmentType.ClassicSharePoint) {
      lists = this._getListData();
    }

    const element: React.ReactElement<IHeyFaddaProps > = React.createElement(
      HeyFadda,
      {
        lists: lists
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        return { value: data };
      }) as Promise<ISPLists>;
  }

  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
