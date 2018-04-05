import * as firebase from 'firebase';

export class Config {

    public lastPublication: Date = new Date();
    public version: string = '';
    public changelog: ChangelogItem[] = [];
    public languages: string[] = [];

}

export interface ChangelogItem {
    version: string;
    date: Date;
    text: string;
} 