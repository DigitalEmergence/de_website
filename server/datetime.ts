export function onGET (ctx:any) {
    const date = new Date();
    return ctx.response.json({ datetime: date.toLocaleString() });
}    
