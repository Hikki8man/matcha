export function timeAgo(raw_date: Date) {
    const date = new Date(raw_date);
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;

    if (timeDifference < minute) {
        const seconds = Math.floor(timeDifference / 1000);
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < hour) {
        const minutes = Math.floor(timeDifference / minute);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < day) {
        const hours = Math.floor(timeDifference / hour);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(timeDifference / day);
        return days == 1 ? 'Yesterday' : `${days} days ago`;
    }
}
