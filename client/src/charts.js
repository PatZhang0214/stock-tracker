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
    chart.applyNewData(arr)
    chart1.applyNewData(arr)
    chart2.applyNewData(arr)
    chart1.setStyles(chartOptions)
    chart2.setStyles(chartOptions)

}