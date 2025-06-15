// medical-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Sample data for demonstration
  patientData = {
    appointmentsMonthly: [65, 59, 80, 81, 56, 55, 40, 45, 50, 62, 68, 72],
    patientDemographics: {
      ageGroups: ['0-17', '18-35', '36-50', '51-65', '65+'],
      counts: [120, 350, 280, 240, 180]
    },
    conditionPrevalence: {
      conditions: ['Hypertension', 'Diabetes', 'Asthma', 'Heart Disease', 'Arthritis'],
      counts: [210, 160, 130, 90, 120]
    },
    treatmentOutcomes: {
      categories: ['Improved', 'Stable', 'Declined', 'Unknown'],
      counts: [65, 23, 8, 4]
    }
  };

  appointmentsChart: any;
  demographicsChart: any;
  conditionsChart: any;
  outcomesChart: any;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.initCharts();
    }, 300);
  }

  initCharts(): void {
    this.createAppointmentsChart();
    this.createDemographicsChart();
    this.createConditionsChart();
    this.createOutcomesChart();
  }

  createAppointmentsChart(): void {
    const ctx = document.getElementById('appointmentsChart') as HTMLCanvasElement;
    this.appointmentsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Monthly Appointments',
          data: this.patientData.appointmentsMonthly,
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Appointment Trends',
            font: { size: 16 }
          },
          legend: {
            display: false
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Appointments'
            }
          }
        }
      }
    });
  }

  createDemographicsChart(): void {
    const ctx = document.getElementById('demographicsChart') as HTMLCanvasElement;
    this.demographicsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.patientData.patientDemographics.ageGroups,
        datasets: [{
          label: 'Patient Age Distribution',
          data: this.patientData.patientDemographics.counts,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(37, 99, 235, 0.7)',
            'rgba(29, 78, 216, 0.7)',
            'rgba(30, 64, 175, 0.7)',
            'rgba(30, 58, 138, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Patient Demographics by Age',
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Patients'
            }
          }
        }
      }
    });
  }

  createConditionsChart(): void {
    const ctx = document.getElementById('conditionsChart') as HTMLCanvasElement;
    this.conditionsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.patientData.conditionPrevalence.conditions,
        datasets: [{
          data: this.patientData.conditionPrevalence.counts,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(37, 99, 235, 0.7)',
            'rgba(29, 78, 216, 0.7)',
            'rgba(30, 64, 175, 0.7)',
            'rgba(30, 58, 138, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Common Conditions',
            font: { size: 16 }
          },
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  createOutcomesChart(): void {
    const ctx = document.getElementById('outcomesChart') as HTMLCanvasElement;
    this.outcomesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.patientData.treatmentOutcomes.categories,
        datasets: [{
          data: this.patientData.treatmentOutcomes.counts,
          backgroundColor: [
            'rgba(34, 197, 94, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(156, 163, 175, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Treatment Outcomes',
            font: { size: 16 }
          }
        }
      }
    });
  }
}