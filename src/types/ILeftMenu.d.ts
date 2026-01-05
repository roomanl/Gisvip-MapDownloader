interface ILeftMenu {
    title: string;
    icon: string;
    key: string;
    type: string;
    router: string;
    subPanel?: Boolean;
    callback?: Function;
}