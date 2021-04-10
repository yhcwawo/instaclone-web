import 'styled-components';

declare module 'styled-components'{
    export interface DefaultTheme{
        fontColor: string;
        bgColor: string;
        borderColor: string;
        accent: string;
    }
}