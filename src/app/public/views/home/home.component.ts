import { Component } from '@angular/core';
import { CardModel } from '../../../shared/components/card/card-model';
import { SelectData, SelectValues } from '../../../shared/components/select/selectModel';
import { DoctorService } from '../../../_core/services/doctor.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  bannerTitle = 'Your Health, Our Priority';
  bannerSubtitle = 'Professional medical consulting services for you and your family';
  bannerCta = 'Book Consultation';
  bannerCtaLink = '/appointments';
  speList = [
    { "id": 20, "name": "Anestesiología", "type": "Especialización" },
    { "id": 4, "name": "Cardiología", "type": "Especialización" },
    { "id": 18, "name": "Cirugía General", "type": "Especialización" },
    { "id": 5, "name": "Dermatología", "type": "Especialización" },
    { "id": 12, "name": "Endocrinología", "type": "Especialización" },
    { "id": 13, "name": "Gastroenterología", "type": "Especialización" },
    { "id": 3, "name": "Ginecología y Obstetricia", "type": "Especialización" },
    { "id": 1, "name": "Medicina General", "type": "Especialización" },
    { "id": 19, "name": "Medicina Interna", "type": "Especialización" },
    { "id": 16, "name": "Nefrología", "type": "Especialización" },
    { "id": 14, "name": "Neumología", "type": "Especialización" },
    { "id": 8, "name": "Neurología", "type": "Especialización" },
    { "id": 6, "name": "Oftalmología", "type": "Especialización" },
    { "id": 17, "name": "Oncología", "type": "Especialización" },
    { "id": 7, "name": "Otorrinolaringología", "type": "Especialización" },
    { "id": 2, "name": "Pediatría", "type": "Especialización" },
    { "id": 9, "name": "Psiquiatría", "type": "Especialización" },
    { "id": 15, "name": "Reumatología", "type": "Especialización" },
    { "id": 10, "name": "Traumatología y Ortopedia", "type": "Especialización" },
    { "id": 11, "name": "Urología", "type": "Especialización" }
  ]
  speListresults = [
    { "id": 20, "name": "Anestesiología", "type": "Especialización" },
    { "id": 4, "name": "Cardiología", "type": "Especialización" },
    { "id": 18, "name": "Cirugía General", "type": "Especialización" },
    { "id": 5, "name": "Dermatología", "type": "Especialización" },
    { "id": 12, "name": "Endocrinología", "type": "Especialización" },
    { "id": 13, "name": "Gastroenterología", "type": "Especialización" },
    { "id": 3, "name": "Ginecología y Obstetricia", "type": "Especialización" },
  ]
  speSelect:SelectData = {
    placeholder: "search specialty",
    list:this.speListresults
  }
  
  // Featured services
  featuredServices: CardModel[] = [
    {
      title: 'General Consultation',
      subtitle: 'Available 24/7',
      description: 'Comprehensive medical advice for all your health concerns with experienced physicians.',
      imageSrc: 'assets/images/services/general-consultation.jpg',
      imageAlt: 'General Consultation',
      linkText: 'Book Now',
      linkUrl: '/services/general-consultation',
      cardType: 'service',
      tags: ['Primary Care', '24/7'],
      featured: true
    },
    {
      title: 'Pediatric Care',
      subtitle: 'Child-focused approach',
      description: 'Specialized healthcare for infants, children, and adolescents with pediatric specialists.',
      imageSrc: 'assets/images/services/pediatric-care.jpg',
      imageAlt: 'Pediatric Care',
      linkText: 'Learn More',
      linkUrl: '/services/pediatric-care',
      cardType: 'service',
      tags: ['Children', 'Vaccines', 'Development']
    },
    {
      title: 'Mental Health',
      subtitle: 'Confidential support',
      description: 'Professional mental health services including therapy, counseling, and psychiatric care.',
      imageSrc: 'assets/images/services/mental-health.png',
      imageAlt: 'Mental Health Services',
      linkText: 'Book Appointment',
      linkUrl: '/services/mental-health',
      cardType: 'service',
      tags: ['Therapy', 'Counseling', 'Support']
    }
  ];
  
  // Top doctors
  topDoctors: CardModel[] = [
    {
      title: 'Dr. Jane Smith',
      subtitle: 'Cardiologist',
      description: 'Specializes in cardiovascular health with over 15 years of experience in treating heart conditions.',
      imageSrc: 'assets/images/doctors/jane-smith.jpg',
      imageAlt: 'Dr. Jane Smith',
      linkText: 'View Profile',
      linkUrl: '/doctors/jane-smith',
      cardType: 'doctor',
      rating: 4.9,
      tags: ['Cardiology', 'Heart Disease'],
      featured: true
    },
    {
      title: 'Dr. Michael Chen',
      subtitle: 'Pediatrician',
      description: 'Dedicated to childrens health with a gentle approach and comprehensive care for all ages.',
      imageSrc: 'assets/images/doctors/michael-chen.jpg',
      imageAlt: 'Dr. Michael Chen',
      linkText: 'View Profile',
      linkUrl: '/doctors/michael-chen',
      cardType: 'doctor',
      rating: 4.8,
      tags: ['Pediatrics', 'Child Development']
    },
    {
      title: 'Dr. Sarah Johnson',
      subtitle: 'Neurologist',
      description: 'Expert in neurological disorders with advanced training in the latest diagnostic techniques.',
      imageSrc: 'assets/images/doctors/sarah-johnson.jpg',
      imageAlt: 'Dr. Sarah Johnson',
      linkText: 'View Profile',
      linkUrl: '/doctors/sarah-johnson',
      cardType: 'doctor',
      rating: 4.7,
      tags: ['Neurology', 'Headache', 'Stroke']
    },
    {
      title: 'Dr. Robert Williams',
      subtitle: 'Family Medicine',
      description: 'Provides comprehensive care for the entire family with a focus on preventive medicine.',
      imageSrc: 'assets/images/doctors/robert-williams.webp',
      imageAlt: 'Dr. Robert Williams',
      linkText: 'View Profile',
      linkUrl: '/doctors/robert-williams',
      cardType: 'doctor',
      rating: 4.9,
      tags: ['Family Medicine', 'Preventive Care']
    }
  ];
  
  // Latest health info
  healthInfo: CardModel[] = [
    {
      title: 'COVID-19 Updates',
      subtitle: 'Important Information',
      description: 'Latest information on COVID-19 vaccinations, boosters, and clinic protocols for your safety.',
      imageSrc: 'assets/images/info/covid-updates.jpg',
      imageAlt: 'COVID-19 Information',
      linkText: 'Read More',
      linkUrl: '/info/covid',
      cardType: 'info',
      tags: ['COVID-19', 'Vaccination', 'Safety']
    },
    {
      title: 'Seasonal Allergies',
      subtitle: 'Spring 2025 Guide',
      description: 'Tips and treatments to manage seasonal allergies as we enter the spring season.',
      imageSrc: 'assets/images/info/allergies.jpg',
      imageAlt: 'Seasonal Allergies Information',
      linkText: 'Read More',
      linkUrl: '/info/allergies',
      cardType: 'info',
      tags: ['Allergies', 'Spring', 'Treatments']
    },
    {
      title: 'Preventive Health Screenings',
      subtitle: 'Check-up Reminder',
      description: 'Why regular health screenings are important and which ones you should consider based on age and risk factors.',
      imageSrc: 'assets/images/info/screenings.jpg',
      imageAlt: 'Preventive Health Screenings',
      linkText: 'Schedule Screening',
      linkUrl: '/services/screenings',
      cardType: 'info',
      tags: ['Prevention', 'Screening', 'Health Check']
    }
  ];
  
  // User appointments (example - in a real app, these would come from a service)
  upcomingAppointments: CardModel[] = [
    {
      title: 'Annual Physical',
      subtitle: 'March 25, 2025 - 10:30 AM',
      description: 'Annual physical examination with Dr. Robert Williams in Room 305.',
      cardType: 'appointment',
      linkText: 'Manage Appointment',
      linkUrl: '/appointments/123456',
      tags: ['Physical Exam', 'Dr. Williams']
    },
    {
      title: 'Dental Check-up',
      subtitle: 'April 10, 2025 - 2:15 PM',
      description: 'Regular dental check-up and cleaning with Dr. Lisa Anderson.',
      cardType: 'appointment',
      linkText: 'Manage Appointment',
      linkUrl: '/appointments/123457',
      tags: ['Dental', 'Dr. Anderson']
    }
  ];
constructor(private doctorService: DoctorService, private authService: AuthService, private router: Router){
  authService.updateRoles()
}

  searchSpe(search: string){
    if(search.length >= 1 && search.length <=3){
      this.speSelect.list =  this.speList.filter(spe => spe.name.toLowerCase().startsWith(search.toLowerCase()))
    }

    console.log(search)
  }
  speSelected(selected: SelectValues){
    console.log(selected)
    this.router.navigate(["search-appment/"+ selected.name.toLowerCase().replace(" ", "-")+ "/"+ selected.id])
  }
  getSpe(){
    
  }
  gotoChat(){
    this.router.navigate(["chat"])
  }
}
