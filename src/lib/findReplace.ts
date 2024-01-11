export const findAndReplace = (html:string, replace: { key : string, value : string | number }[]) => {
    let htmlText = html;
    
    for(const item of replace){
        const regex = new RegExp(`${item.key}`, 'g');
        htmlText = htmlText.replace(regex, `${item.value}`);
    }   

    return htmlText;
}