export function formatMessageTime(date: string): string {
    if(!date) {return "error"}
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}