import BlogSlider from '@/components/home/BlogSlider'
import BrowseByCategory from '@/components/home/BrowsCategory'
import HeroBanner from '@/components/home/HeroBanner'
import SectionBox from '@/components/home/SectionBox'

export default function Home() {
  return (
    <div>
      <>
        <HeroBanner />
        <BrowseByCategory />
        <SectionBox />
        <BlogSlider />
      </>
    </div>
  )
}
