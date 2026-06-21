import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { LandingNav } from './LandingNav';
import { HeroCarousel } from '../vod/HeroCarousel';
import { InstructorMarquee } from './InstructorMarquee';
import { PopularSection } from './PopularSection';
import { ComingSoonSection } from './ComingSoonSection';
import { NewsletterSignup } from './NewsletterSignup';
import { CoursePreviewModal } from './CoursePreviewModal';
import { COURSES, INITIAL_VIDEOS } from '../../constants';
import { filterValidVideos } from '../../services/videoValidationService';
import { getExperts } from '../../data/experts';
import { ExpertAvatar } from '../experts/ExpertAvatar';
import { FOUNDER_TOPICS } from '../../data/topics';
import { HeroCarouselItem, Course, Video } from '../../types';

interface LandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSignIn, onGetStarted }) => {
  // Modal state
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    item: Course | Video | null;
    itemType: 'course' | 'video';
  }>({ isOpen: false, item: null, itemType: 'course' });

  // Real expert faces for the hero grid + marquee (only those with real portraits)
  const expertsWithPhotos = getExperts(filterValidVideos(INITIAL_VIDEOS).filter(v => !v.isVertical))
    .filter(e => e.image);
  const faces = expertsWithPhotos.slice(0, 9);
  const marqueeInstructors = expertsWithPhotos.map(e => ({ name: e.name, role: e.role, image: e.image as string }));

  // Hero carousel items for landing
  const heroCarouselItems: HeroCarouselItem[] = [
    { type: 'course', item: COURSES[0] },
    { type: 'video', item: INITIAL_VIDEOS[0] },
    { type: 'course', item: COURSES[1] },
    { type: 'video', item: INITIAL_VIDEOS[4] },
    { type: 'course', item: COURSES[2] },
    { type: 'video', item: INITIAL_VIDEOS[8] },
  ];

  const handleMoreInfo = (carouselItem: HeroCarouselItem) => {
    setPreviewModal({
      isOpen: true,
      item: carouselItem.item,
      itemType: carouselItem.type,
    });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, item: null, itemType: 'course' });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Masterclass-Style Top Nav */}
      <LandingNav onSignIn={onSignIn} onGetStarted={onGetStarted} />

      {/* Bold MasterClass-style hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-6 md:px-8 overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#c9a227]/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <div>
            <span className="mc-label text-[#c9a227]">Signal, not noise</span>
            <h1 className="mc-heading text-5xl md:text-6xl xl:text-7xl text-white mt-3 leading-[0.95]">
              Learn from the<br />founders who've<br /><span className="text-[#c9a227]">done it.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-[#a3a3a3]">
              The best startup advice on the internet — curated from the biggest names
              and organized into the paths that matter at every stage.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a227] text-black font-bold rounded-md hover:bg-[#d4af37] transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onSignIn}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 text-white font-semibold rounded-md border border-white/15 hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
            </div>
            <p className="mt-5 text-sm text-[#737373]">
              {INITIAL_VIDEOS.length}+ curated talks · {FOUNDER_TOPICS.length} topics · 100% free
            </p>
          </div>

          {/* Faces grid */}
          <div className="grid grid-cols-3 gap-3">
            {faces.map((expert, i) => (
              <button
                key={expert.slug}
                onClick={onGetStarted}
                className={`group relative rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all ${
                  i === 0 || i === 5 ? 'row-span-2 aspect-[3/4]' : 'aspect-square'
                }`}
              >
                <ExpertAvatar
                  name={expert.name}
                  image={expert.image}
                  className="absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                  initialsClass="text-4xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-semibold line-clamp-1">{expert.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured paths carousel */}
      <div>
        <HeroCarousel
          items={heroCarouselItems}
          variant="landing"
          autoPlayInterval={6000}
          onMoreInfo={handleMoreInfo}
          onPlayClick={onGetStarted}
        />
      </div>

      {/* Auto-Scrolling Instructor Marquee */}
      <InstructorMarquee
        instructors={marqueeInstructors}
        onInstructorClick={onGetStarted}
      />

      {/* Course Preview Modal */}
      <CoursePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        onGetStarted={() => {
          closePreviewModal();
          onGetStarted();
        }}
        item={previewModal.item}
        itemType={previewModal.itemType}
      />

      {/* Popular Now Section */}
      <PopularSection
        courses={COURSES}
        onCourseClick={onGetStarted}
      />

      {/* Coming Soon Section */}
      <ComingSoonSection />

      {/* Browse by Topic Section */}
      <section className="py-16 px-6 md:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="mc-label text-[#c9a227]">Explore</span>
            <h2 className="mc-heading text-3xl md:text-4xl text-white mt-2">
              Browse by Topic
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FOUNDER_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={onGetStarted}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all text-left"
              >
                <img
                  src={topic.cover}
                  alt={topic.title}
                  className="kenburns absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(140deg, ${topic.accent}40, transparent 55%)` }}
                />
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <h3 className="text-white font-bold text-sm leading-tight">{topic.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="mc-label text-[#c9a227]">Simple Process</span>
            <h2 className="mc-heading text-4xl md:text-5xl text-white mt-2">
              How Fasterclass Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">1</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Choose Your Path</h3>
              <p className="text-[#a3a3a3]">
                Pick from curated courses or browse individual lessons by topic.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">2</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Learn at Your Pace</h3>
              <p className="text-[#a3a3a3]">
                Watch expert videos, take quizzes, and master key concepts with flashcards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#c9a227]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-display font-bold text-[#c9a227]">3</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Go Deep</h3>
              <p className="text-[#a3a3a3]">
                Pick up where you left off, save your playbook, and lock in concepts with quick drills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-8 bg-gradient-to-r from-[#c9a227]/5 to-[#a88520]/5 border-y border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {INITIAL_VIDEOS.length}+
              </p>
              <p className="text-[#a3a3a3]">Expert Videos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                {COURSES.length}
              </p>
              <p className="text-[#a3a3a3]">Curated Courses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">50+</p>
              <p className="text-[#a3a3a3]">Expert Instructors</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2">100%</p>
              <p className="text-[#a3a3a3]">Free Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mc-heading text-4xl md:text-5xl text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-[#a3a3a3] mb-8">
            Join thousands of founders learning to build successful startups.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#c9a227] text-black font-bold text-lg rounded-md hover:bg-[#d4af37] transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[#737373] text-sm mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Footer */}
      <footer className="py-12 px-6 md:px-8 border-t border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/brand/fasterclass-mark.png" alt="FasterClass" className="h-7 w-auto" />
            <span className="text-lg font-bold text-white tracking-tight">FasterClass</span>
          </div>
          <p className="text-[#737373] text-sm">
            Built for founders, by founders.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
