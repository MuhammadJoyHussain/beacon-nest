import Header from '@/components/dashboard/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Target,
  Compass,
  Users,
  Briefcase,
  CheckCircle2,
  Star,
  TrendingUp,
  ShieldCheck,
  Globe,
  Building2,
  ArrowRight,
} from 'lucide-react'

export default function AboutUs() {
  const shell = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 170, damping: 18 },
    },
  }
  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  }

  return (
    <div className='relative min-h-screen overflow-hidden text-[#3D52A0]'>
      <div className='absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#E9EEFF,transparent_60%),radial-gradient(900px_500px_at_110%_10%,#FFF7F2,transparent_60%),radial-gradient(900px_700px_at_50%_120%,#F2FFFB,transparent_60%)]' />
      <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#7091E6]/30 blur-3xl animate-blob' />
      <div className='pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3D52A0]/20 blur-3xl animate-blob animation-delay-2000' />
      <div className='pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#B8C1EC]/20 blur-3xl animate-blob animation-delay-4000' />

      <Header />

      <main className='relative max-w-7xl mx-auto px-4 pt-24 pb-16'>
        <motion.section
          variants={shell}
          initial='hidden'
          animate='show'
          className='glass-card overflow-hidden'
        >
          <div className='relative px-6 md:px-10 py-12'>
            <div className='absolute inset-0 opacity-30'>
              <svg width='100%' height='100%'>
                <defs>
                  <pattern
                    id='grid-about'
                    width='32'
                    height='32'
                    patternUnits='userSpaceOnUse'
                  >
                    <path
                      d='M 32 0 L 0 0 0 32'
                      fill='none'
                      stroke='#3D52A0'
                      strokeOpacity='0.08'
                      strokeWidth='1'
                    />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#grid-about)' />
              </svg>
            </div>
            <div className='relative z-10 text-center max-w-3xl mx-auto'>
              <div className='mx-auto inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium ring-1 ring-black/5 border border-white/40'>
                <Sparkles className='h-3.5 w-3.5' />
                people-first recruiting
              </div>
              <h1 className='mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[#1B2559]'>
                About Beacon Nest
              </h1>
              <p className='mt-3 text-[#3D52A0]/80 text-base md:text-lg'>
                We connect ambitious people with purposeful companies through a
                human, transparent hiring journey.
              </p>
              <div className='mt-8 flex items-center justify-center gap-3'>
                <Link href='/career' className='btn-gradient'>
                  Browse Jobs
                </Link>
                <Link
                  href='/contact'
                  className='inline-flex items-center gap-2 rounded-2xl bg-white/80 backdrop-blur px-6 py-3 text-[#3D52A0] font-semibold ring-1 ring-black/5 border border-white/40 hover:bg-white'
                >
                  Contact Us <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={list}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.3 }}
          className='mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4'
        >
          {[
            { k: 'roles', v: '3k+', t: 'Active roles' },
            { k: 'partners', v: '1.2k', t: 'Hiring partners' },
            { k: 'countries', v: '52', t: 'Countries' },
            { k: 'placed', v: '30k+', t: 'Placed candidates' },
          ].map((s) => (
            <motion.div key={s.k} variants={item} className='glass-panel p-5'>
              <div className='text-2xl font-extrabold text-[#1B2559]'>
                {s.v}
              </div>
              <div className='text-xs text-[#3D52A0]/70'>{s.t}</div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          variants={shell}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.25 }}
          className='mt-12 grid lg:grid-cols-2 gap-6'
        >
          <div className='glass-panel p-6 md:p-8'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Users className='h-4 w-4' /> Who We Are
            </div>
            <h3 className='mt-2 text-2xl font-extrabold text-[#1B2559]'>
              Hiring, made human
            </h3>
            <p className='mt-2 text-[#3D52A0]/85 leading-relaxed'>
              Founded by recruiters and HR strategists, Beacon Nest partners
              with startups and global brands to build high-performing,
              inclusive teams. We align your ambitions with the right
              opportunities.
            </p>
            <ul className='mt-4 space-y-2 text-sm'>
              {[
                'Transparent process',
                'Personalized guidance',
                'Diverse talent network',
              ].map((x, i) => (
                <li key={i} className='flex items-start gap-2'>
                  <CheckCircle2 className='h-4 w-4 mt-0.5 text-[#7091E6]' />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='glass-panel p-6 md:p-8'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Target className='h-4 w-4' /> Our Vision
            </div>
            <h3 className='mt-2 text-2xl font-extrabold text-[#1B2559]'>
              Where talent meets purpose
            </h3>
            <p className='mt-2 text-[#3D52A0]/85 leading-relaxed'>
              We envision a world where careers elevate lives and companies
              thrive because of the people behind them. We’re the bridge that
              makes great matches happen.
            </p>
            <div className='mt-4 flex flex-wrap gap-2'>
              <span className='chip chip-1'>Impact-driven</span>
              <span className='chip chip-2'>Inclusive</span>
              <span className='chip chip-3'>Future-ready</span>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={shell}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.25 }}
          className='mt-12 grid lg:grid-cols-2 gap-6'
        >
          <div className='glass-panel p-6 md:p-8'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Briefcase className='h-4 w-4' /> What We Do
            </div>
            <ul className='mt-3 grid sm:grid-cols-2 gap-3 text-sm'>
              {[
                'Permanent & contract hiring',
                'Executive search',
                'Tech, marketing, sales, ops',
                'Candidate screening',
                'Employer branding',
                'Talent advisory',
              ].map((x, i) => (
                <li
                  key={i}
                  className='rounded-xl bg-white/70 px-3 py-2 ring-1 ring-black/5 border border-white/40 flex items-center gap-2'
                >
                  <CheckCircle2 className='h-4 w-4 text-[#7091E6]' />
                  {x}
                </li>
              ))}
            </ul>
          </div>

          <div className='glass-panel p-6 md:p-8'>
            <div className='flex items-center gap-2 text-sm font-semibold'>
              <Compass className='h-4 w-4' /> Why Choose Us
            </div>
            <div className='grid sm:grid-cols-2 gap-4 mt-3 text-sm'>
              <div className='rounded-2xl bg-[#E9EEFF] p-4'>
                <div className='font-semibold text-[#1B2559] flex items-center gap-2'>
                  <Star className='h-4 w-4' /> Expertise
                </div>
                <p className='mt-1 text-[#3D52A0]/80'>
                  Deep domain knowledge across sectors.
                </p>
              </div>
              <div className='rounded-2xl bg-[#FFF7F2] p-4'>
                <div className='font-semibold text-[#1B2559] flex items-center gap-2'>
                  <TrendingUp className='h-4 w-4' /> Outcomes
                </div>
                <p className='mt-1 text-[#3D52A0]/80'>
                  Faster hiring and better retention.
                </p>
              </div>
              <div className='rounded-2xl bg-[#F2FFFB] p-4'>
                <div className='font-semibold text-[#1B2559] flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4' /> Trust
                </div>
                <p className='mt-1 text-[#3D52A0]/80'>
                  Honest feedback and clear communication.
                </p>
              </div>
              <div className='rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 border border-white/40'>
                <div className='font-semibold text-[#1B2559] flex items-center gap-2'>
                  <Globe className='h-4 w-4' /> Reach
                </div>
                <p className='mt-1 text-[#3D52A0]/80'>
                  Global network with local context.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          variants={shell}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
          className='mt-12 glass-card p-6 md:p-8'
        >
          <div className='flex items-center gap-2 text-sm font-semibold'>
            <Building2 className='h-4 w-4' /> Our Process
          </div>
          <div className='mt-4 grid md:grid-cols-4 gap-4'>
            {[
              {
                n: '01',
                t: 'Discover',
                d: 'Understand goals, culture, and role fit.',
              },
              {
                n: '02',
                t: 'Search',
                d: 'Targeted outreach and curated shortlists.',
              },
              {
                n: '03',
                t: 'Select',
                d: 'Structured interviews and assessments.',
              },
              {
                n: '04',
                t: 'Support',
                d: 'Offer, onboarding, and post-hire check-ins.',
              },
            ].map((s) => (
              <div
                key={s.n}
                className='rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 border border-white/40'
              >
                <div className='text-xs font-semibold text-[#3D52A0]/70'>
                  {s.n}
                </div>
                <div className='text-lg font-bold text-[#1B2559]'>{s.t}</div>
                <p className='mt-1 text-sm text-[#3D52A0]/80'>{s.d}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={shell}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.2 }}
          className='mt-12'
        >
          <div className='rounded-3xl bg-gradient-to-r from-[#3D52A0] via-[#5F79D4] to-[#7091E6] p-8 md:p-10 text-white shadow-xl'>
            <h2 className='text-3xl md:text-4xl font-extrabold'>
              Ready to grow with us?
            </h2>
            <p className='mt-2 text-white/90 max-w-2xl'>
              Whether you’re hiring or job hunting, Beacon Nest guides the way
              with clarity and care.
            </p>
            <div className='mt-6 flex flex-wrap items-center gap-3'>
              <Link
                href='/contact'
                className='inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-[#3D52A0] font-semibold shadow hover:shadow-md active:scale-[.99]'
              >
                Contact Us <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                href='/career'
                className='inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3 text-white font-semibold ring-1 ring-white/40 hover:bg-white/25'
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  )
}
