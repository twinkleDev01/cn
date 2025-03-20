import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-contact-lead',
  templateUrl: './contact-lead.component.html',
  styleUrls: ['./contact-lead.component.scss']
})
export class ContactLeadComponent implements OnInit {
  totalViews: number = 1000;
  uniqueVisitors: number = 850;
  repeatVisitors: number = 150;
  showAdvancedFilter = false;
  selectedChart: string = 'country';

  // Progress Bar Percentage calculation
  get totalViewsPercentage(): number {
    return 100;
  }
  get uniqueVisitorsPercentage(): number {
    return (this.uniqueVisitors / this.totalViews) * 100;
  }
  get repeatVisitorsPercentage(): number {
    return (this.repeatVisitors / this.totalViews) * 100;
  }

  ngOnInit(): void {
    this.createUserTypeChart();
    this.createCityChart();
  }

  // User dashboard chart
  createUserTypeChart() {
    const ctx = document.getElementById('userTypeChartC1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Carrier', 'Shipper', 'Guest'],
        datasets: [{
          data: [60, 25, 15],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: window.innerWidth < 576 ? 1 : 1,
        plugins: {
          legend: {
            position: window.innerWidth < 576 ? 'bottom' : 'bottom',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              padding: window.innerWidth < 576 ? 12 : window.innerWidth < 768 ? 8 : 14,
              font: {
                size: window.innerWidth < 576 ? 11 : window.innerWidth < 768 ? 12 : 12,
                weight: 'bold'
              },
              boxWidth: window.innerWidth < 576 ? 8 : 12,
              color: '#000',
            }
          },
          tooltip: {
            titleFont: {
              size: window.innerWidth < 576 ? 10 : 12
            },
            bodyFont: {
              size: window.innerWidth < 576 ? 9 : 11
            },
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw}%`;
              }
            }
          }
        },
        radius: window.innerWidth < 576 ? '70%' : '100%'
      }
    });
  }

  // Top country chart
  ngAfterViewInit() {
    const ctx = document.getElementById('topCountryChartC1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['USA', 'Canada', 'Mexico'],
        datasets: [{
          data: [75, 15, 10],
          backgroundColor: [
            'rgba(54, 162, 235 )',
            'rgba(255, 99, 132 )',
            'rgba(75, 192, 192 )'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1,
          maxBarThickness: 40,
          categoryPercentage: 0.6,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true
            },
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createCityChart() {
    const ctxCity = document.getElementById('cityDistributionChartC1') as HTMLCanvasElement;
    new Chart(ctxCity, {
      type: 'bar',
      data: {
        labels: ['Los Angeles', 'New York', 'Toronto'],
        datasets: [{
          data: [60, 20, 20],
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc'
          ],
          borderColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc'
          ],
          borderWidth: 1,
          maxBarThickness: 40,
          categoryPercentage: 0.6,
          barPercentage: 0.7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              display: true
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              },
              callback: function(value) {
                return value + '%';
              }
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12
              }
            }
          }
        }
      }
    });
  }
  
  // Profile analytics table
  displayedColumns: string[] = ['name',  'pageSource', 'location', 'platform', 'os', 'browser', 'accessedAt', 'timeSinceAccess'];
  dataSource = [
    { name: 'Jax Logistics LLC',
      pageSource: 'Profile View',
      location: '82934, Alachua, Florida',
      platform: 'fa-desktop',
      os: '/assets/images/windows.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Guest User',
      pageSource: 'Broker list in City',
      location: '43232, Columbus, Ohio',
      platform: 'fa-tablet',
      os: '/assets/images/android.png',
      browser: '/assets/images/safari.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Authority Page',
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/ios.png',
      browser: '/assets/images/firefox.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Insurance Page',
      location: '43232, Columbus, Ohio',
      platform: 'fa-desktop',
      os: '/assets/images/macOS.png',
      browser: '/assets/images/opera.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Broker list in City',
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/linux.png',
      browser: '/assets/images/other_browser.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Broker list in City',
      location: '92807, Anaheim Hills, CA ',
      platform: 'fa-desktop',
      os: '/assets/images/ubuntu.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Authority Page',
      location: '96101, Alturas, Califonia',
      platform: 'fa-desktop',
      os: '/assets/images/other_os.png',
      browser: '/assets/images/safari.png',
      accessedAt: '09 Oct, 2020',
      timeSinceAccess: '2 hours ago'
    },    { name: 'Jax Logistics LLC 1',
      pageSource: 'Insurance Page',
      location: '43232, Columbus, Ohio',
      platform: 'fa-mobile',
      os: '/assets/images/linux.png',
      browser: '/assets/images/other_browser.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Authority Page',
      location: '92807, Anaheim Hills, CA ',
      platform: 'fa-desktop',
      os: '/assets/images/ubuntu.png',
      browser: '/assets/images/chrome.png',
      accessedAt: '29 Dec, 2023',
      timeSinceAccess: '2 hours ago'
    },
    { name: 'Jax Logistics LLC 1',
      pageSource: 'Broker list in City',
      location: '96101, Alturas, Califonia',
      platform: 'fa-desktop',
      os: '/assets/images/other_os.png',
      browser: '/assets/images/safari.png',
      accessedAt: '09 Oct, 2020',
      timeSinceAccess: '2 hours ago'
    },
  ];

  // Advanced filter toggle
  constructor() { }
  toggleFilter() {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }


}
