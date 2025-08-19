import { useState } from 'react';
import Button from './Button';

const DesignSystemShowcase = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="space-2xl bg-cream min-h-screen">
      <div className="container-default space-xl">
        {/* Typography Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Typography System</h2>
          <div className="space-y-6">
            <div>
              <h1 className="text-hero">Hero Text - Elite Way Limo</h1>
              <p className="text-caption">text-hero class applied</p>
            </div>
            <div>
              <h2 className="text-section-title">Section Title Text</h2>
              <p className="text-caption">text-section-title class applied</p>
            </div>
            <div>
              <h3 className="text-card-title">Card Title Text</h3>
              <p className="text-caption">text-card-title class applied</p>
            </div>
            <div>
              <p className="text-body-large">Large body text for important content and introductions</p>
              <p className="text-caption">text-body-large class applied</p>
            </div>
            <div>
              <p className="text-body">Regular body text for general content and descriptions</p>
              <p className="text-caption">text-body class applied</p>
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Button System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-card-title">Variants</h3>
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="luxury">Luxury Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-card-title">Sizes</h3>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-card-title">States</h3>
              <Button loading={loading} onClick={handleLoadingTest}>
                {loading ? 'Loading...' : 'Test Loading State'}
              </Button>
              <Button disabled>Disabled Button</Button>
            </div>
          </div>
        </section>

        {/* Color System Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Color System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-sm bg-primary-gold text-white rounded-xl text-center">
              <p className="text-card-title">Primary Gold</p>
              <p className="text-micro">#D4AF37</p>
            </div>
            <div className="space-sm bg-gold text-white rounded-xl text-center">
              <p className="text-card-title">Gold</p>
              <p className="text-micro">#D4AF37</p>
            </div>
            <div className="space-sm bg-success text-white rounded-xl text-center">
              <p className="text-card-title">Success</p>
              <p className="text-micro">#10B981</p>
            </div>
            <div className="space-sm bg-error text-white rounded-xl text-center">
              <p className="text-card-title">Error</p>
              <p className="text-micro">#EF4444</p>
            </div>
          </div>
        </section>

        {/* Card System Showcase */}
        <section className="space-lg">
          <h2 className="text-section-title mb-8">Enhanced Card System</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base card-hover space-md">
              <h3 className="text-card-title mb-4">Standard Card</h3>
              <p className="text-body">This card uses the new card-base and card-hover classes for consistent styling and smooth interactions.</p>
            </div>
            
            <div className="glass-effect space-md text-white rounded-2xl">
              <h3 className="text-card-title mb-4">Glass Effect Card</h3>
              <p className="text-body opacity-90">This card demonstrates the glass morphism effect with backdrop blur.</p>
            </div>

            <div className="card-base space-md border-l-4 border-gold">
              <h3 className="text-card-title mb-4 text-gold">Accent Card</h3>
              <p className="text-body">Cards can be enhanced with accent colors and borders for visual hierarchy.</p>
            </div>
          </div>
        </section>

        {/* State Feedback Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced State Feedback</h2>
          <div className="space-y-4">
            <div className="feedback-success">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Success message with enhanced styling and icon
            </div>
            
            <div className="feedback-warning">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Warning message with enhanced styling and icon
            </div>
            
            <div className="feedback-error">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Error message with enhanced styling and icon
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-card-title mb-4">Entrance Animations</h3>
              <div className="space-y-2">
                <div className="p-4 bg-primary-gold/10 rounded-lg animate-fadeIn">Fade In Animation</div>
                <div className="p-4 bg-gold/10 rounded-lg animate-fadeInUp">Fade In Up Animation</div>
                <div className="p-4 bg-success/10 rounded-lg animate-scaleIn">Scale In Animation</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-card-title mb-4">Interactive Animations</h3>
              <div className="space-y-2">
                <div className="p-4 bg-primary-gold/10 rounded-lg hover:animate-float transition-all duration-300">Hover for Float Effect</div>
                <div className="p-4 bg-gold/10 rounded-lg animate-blob">Blob Animation</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
