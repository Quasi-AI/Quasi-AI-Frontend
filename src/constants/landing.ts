import LandingUiIconsServicesPeople from '@/components/landing/ui/icons/services/people.vue'
import LandingUiIconsServicesCalender from '@/components/landing/ui/icons/services/calender.vue'
import LandingUiIconsServicesDocument from '@/components/landing/ui/icons/services/document.vue'
import LandingUiIconsInstructorsProfile from '@/components/landing/ui/icons/instructors/profile.vue'
import LandingUiIconsInstructorsPlay from '@/components/landing/ui/icons/instructors/play.vue'
import LandingUiIconsInstructorsHandshake from '@/components/landing/ui/icons/instructors/handshake.vue'

export const whyChooseItems = ref([
  {
    icon: LandingUiIconsServicesPeople,
    title: 'Expert Tutors',
    description:
      'Learn from industry professionals with years of experience in their fields. Our expert tutors provide practical insights to help you succeed in your learning.'
  },
  {
    icon: LandingUiIconsServicesCalender,
    title: 'Innovative Resources',
    description:
      'Access a vast collection of learning materials, including interactive courses, real-world case studies, and hands-on projects designed to enhance your skills.'
  },
  {
    icon: LandingUiIconsServicesDocument,
    title: 'Seamless Experience',
    description:
      'Enjoy a user-friendly platform designed for effective and engaging learning and retention.'
  }
])

export const instructorSteps = ref([
  {
    icon: LandingUiIconsInstructorsProfile,
    title: '1. Apply to become instructor',
    description:
      'Just create an account for free. Be sure to indicate that you want to be an instructor.'
  },
  {
    icon: LandingUiIconsInstructorsPlay,
    title: '2. Create your new course',
    description:
      'Start creating your study materials and assign students to them right away.'
  },
  {
    icon: LandingUiIconsInstructorsHandshake,
    title: '3. Start teaching & earning',
    description:
      'Right on! Yes, it’s that easy. You’re all set. Congratulations!'
  }
])
