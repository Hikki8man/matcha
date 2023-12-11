export function timeAgo(raw_date: Date) {
    const date = new Date(raw_date);
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;

    if (timeDifference < minute) {
        const seconds = Math.floor(timeDifference / 1000);
        return `il y a ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
    } else if (timeDifference < hour) {
        const minutes = Math.floor(timeDifference / minute);
        return `il y a ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (timeDifference < day) {
        const hours = Math.floor(timeDifference / hour);
        return `il y a ${hours} heure${hours !== 1 ? 's' : ''}`;
    } else {
        const days = Math.floor(timeDifference / day);
        return days == 1 ? 'Hier' : `Il y a ${days} jour${days !== 1 ? 's' : ''}`;
    }
}
