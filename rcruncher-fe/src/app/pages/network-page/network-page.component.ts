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
  private polarAreaChart;
  private colors = ['#F70909', '#F76309', '#F7B609', '#D7F709',
    '#A1F709', '#3DF709', '#09F76D', '#09F7BF',
    '#09D8F7', '#0970F7', '#0925F7', '#0925F7',
    '#8C09F7', '#D709F7', '#F709CB', '#F70980',
    '#69060B', '#68094D', '#560968', '#290968',
    '#093F68', '#096862', '#09682E', '#186809'
  ];
  public currentUserName = '';
  public userName;
  public relatedUsers = [];
  public recommendedSubreddits = [];


  constructor(private readonly dataService: DataService) { }

  ngOnInit() {
    this.dataService.getTrainedUsers().subscribe((data) => {
      const objects = JSON.parse(data.text);
      for (const object of objects) {
        this.datasets.push({
          label: [object.name],
          backgroundColor: "rgba(255,221,50,0.2)",
          borderColor: "rgba(255,221,50,1)",
          data: [{
            x: object.xPosition + object.xDiference,
            y: object.yPosition + object.yDiference,
            r: 20
          }]
        });
      }
      Chart.defaults.global.legend.display = false;

    });
  }

  public chart() {
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
    this.currentUserName = this.userName;
    this.dataService.getUserPrediction(this.userName).subscribe((data) => {
      const dataArray = JSON.parse(data.text);
      this.networkChart.data.datasets.push({
        label: [this.userName],
        backgroundColor: 'rgba(173,216,230, 0.2)',
        borderColor: 'rgba(173,216,230, 1 )',
        data: [{
          x: dataArray[0] + dataArray[2][0],
          y: dataArray[1] + dataArray[2][1],
          r: 20
        }]
      });
      this.networkChart.update();
    });
  }
  public getUserData() {
    this.currentUserName = this.userName;
    this.polarAreaChart = null;
    this.dataService.refreshTopicsForUser(this.userName).subscribe((data) => {
      this.dataService.getUserTopics(this.userName).subscribe((topicsData) => {

        const apps = [];
        const topics = [];
        const cColors = [];
        let index = 0;
        const parsedData = JSON.parse(topicsData.text);
        for (const topic of parsedData) {
          apps.push(topic.numberOfApp);
          topics.push(topic.topicName);
          cColors.push(this.colors[index % this.colors.length]);
          index ++;
        }
        this.polarAreaChart = new Chart(document.getElementById('word-cloud-chart'), {
          type: 'polarArea',
          data: {
            datasets: [{
              data: apps,
              backgroundColor: cColors
            }],
            labels: topics
          }
        });
      });

      this.dataService.getRecommendedData(this.userName).subscribe((recommendedData) => {
        const parsedData = JSON.parse(recommendedData.text);
        this.recommendedSubreddits = parsedData.recommendedSubreddits;
        this.relatedUsers = parsedData.relatedUsers;
      });
    });
  }

}
