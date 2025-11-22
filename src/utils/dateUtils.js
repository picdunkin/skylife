export const getMonday = (d) => {
    d = new Date(d);
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

export const getTodayISO = () => {
    return new Date().toISOString().split('T')[0];
};

export const isDateInCurrentWeek = (dateString) => {
    const date = new Date(dateString);
    const monday = getMonday(new Date());
    monday.setHours(0, 0, 0, 0);
    return date >= monday;
};

export const isDateInLastWeek = (dateString) => {
    const date = new Date(dateString);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
    return date >= oneWeekAgo;
};
