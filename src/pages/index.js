import Footer from '@/components/Footer'
import Header from '@/components/Header'
import BlogSlider from '@/components/home/BlogSlider'
import BrowseByCategory from '@/components/home/BrowsCategory'
import HeroBanner from '@/components/home/HeroBanner'
import JobsSection from '@/components/home/JobsSection'
import JobSection from '@/components/home/JobSection'
import SectionBox from '@/components/home/SectionBox'
import Statistics from '@/components/home/Statistics'
import RecruitersSwiper from '@/components/home/Recruiters'
import JobListings from '@/components/home/JobListings'
import Newsletter from '@/components/home/NewsLetter'

export default function Home() {
  return (
    <div>
      <>
        <Header />
        <HeroBanner />
        <BrowseByCategory />
        <SectionBox />
        <JobsSection />
        <JobSection />
        <Statistics />
        <RecruitersSwiper />
        <JobListings />
        <BlogSlider />
        {/* <Newsletter /> */}
        <Footer />
      </>
    </div>
  )
}
