
export class Config {

    public lastPublication: number = 0;
    public version: string = '';
    public changelog: ChangelogItem[] = [];
    public languages: string[] = [];

}

export interface ChangelogItem {
    version: string;
    date: number;
    text: string;
} 