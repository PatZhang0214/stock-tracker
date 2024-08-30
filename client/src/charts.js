window.onload = async function () {
    const chartOptions = {
        candle: {
            tooltip: { showRule: 'none' } // or 'follow_cross'
        }
    };
    var chart = klinecharts.init('chart')
    var chart1 = klinecharts.init('chart-1')
    var chart2 = klinecharts.init('chart-2')
    chart.setStyles(chartOptions)
    const response = await fetch('http://localhost:3000/api/chart');
    let arr = await response.json()
    chart.applyNewData(arr[0])
    chart1.applyNewData(arr[1])
    chart2.applyNewData(arr[2])
    chart1.setStyles(chartOptions)
    chart2.setStyles(chartOptions)

}