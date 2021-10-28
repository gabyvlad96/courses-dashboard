export const baseUrl = 'http://ec2-34-201-61-71.compute-1.amazonaws.com:8080';

export const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October"];

export const prepareChartData = (data, labels, description, background) => {
    return {
        labels: labels,
        datasets: [{
            label: description,
            data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2,
            backgroundColor: background,
        }]
    }
};
