import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data-services/data.service';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-network-page',
  templateUrl: './network-page.component.html',
  styleUrls: ['./network-page.component.css']
})
export class NetworkPageComponent implements OnInit {
  private datasets = [];
  private networkChart;
  public userName;
  constructor(private readonly dataService: DataService) { }

  ngOnInit() {
    this.dataService.getTrainedUsers().subscribe((data) => {
      const objects = JSON.parse(data.text);
      for (const object of objects) {
        this.datasets.push({
          label: [object.name],
          backgroundColor: "rgba(255,221,50,0.2)",
          borderColor: "rgba(255,221,50,1)",
          data : [{
            x: object.xPosition + object.xDiference,
            y: object.yPosition + object.yDiference,
            r: 20
          }]});
      }

    });
  }

  public chart() {
    Chart.defaults.global.legend.display = false;
    this.networkChart = new Chart(document.getElementById('bubble-chart'), {
      type: 'bubble',
      data: {
        datasets: this.datasets
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: 'Neural kohonen network with czeakanowski distance'
        }, scales: {
          yAxes: [{ 
            scaleLabel: {
              display: true,
              labelString: 'Y'
            }
          }],
          xAxes: [{ 
            scaleLabel: {
              display: true,
              labelString: 'X'
            }
          }]
        }
      }
  });
  }
  public seeUserPrediction() {
    this.dataService.getUserPrediction(this.userName).subscribe((data) => {
      const dataArray = JSON.parse(data.text);
      this.networkChart.data.datasets.push({
        label: [this.userName],
        backgroundColor: 'rgba(173,216,230 ,0.2)',
        borderColor: 'rgba(173,216,230 ,1 )',
        data : [{
          x: dataArray[0] + dataArray[2][0],
          y: dataArray[1] + dataArray[2][1],
          r: 20
        }]});
      this.networkChart.update();
    });
  }

}
