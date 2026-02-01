export const formatSalary = (salary: number): string => {
    if (!salary) return 'Not disclosed';

    if (salary >= 100000) {
        const lpa = salary / 100000;
        const formattedLpa = parseFloat(lpa.toFixed(2));
        return `₹${formattedLpa} LPA`;
    }
    return `₹${salary.toLocaleString('en-IN')}`;
};
