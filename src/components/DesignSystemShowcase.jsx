import { useState } from 'react';
import Button from './Button';

const DesignSystemShowcase = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-8 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
        
        {/* Header */}
        <header className="text-center mb-8 lg:mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4">
            Elite Way Design System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive collection of typography, components, colors, and design patterns 
            used throughout the Elite Way Limo platform.
          </p>
        </header>

        {/* Font System Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Font System</h2>
          
          {/* Font Information */}
          <div className="bg-gradient-to-r from-primary-gold/10 to-primary-gold/5 rounded-xl p-6 mb-8">
            <h3 className="text-card-title mb-4 text-primary-gold">Primary Font Family</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-body-large font-semibold mb-2">Poppins</p>
                <p className="text-body text-gray-600">
                  A geometric sans-serif typeface designed by Indian type designer Jonny Pinhorn. 
                  Loaded from Google Fonts with optimized display swap.
                </p>
                <div className="mt-3 text-sm text-gray-500">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    font-family: "Poppins", sans-serif
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-700">Available Weights:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-light">300 - Light</span>
                  <span className="font-normal">400 - Regular</span>
                  <span className="font-medium">500 - Medium</span>
                  <span className="font-semibold">600 - Semi Bold</span>
                  <span className="font-bold">700 - Bold</span>
                  <span className="text-gray-400">800 - Extra Bold (fallback)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Font Weights Demonstration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-card-title mb-6">Font Weight Variations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-2xl font-light mb-1">Font Light (300)</p>
                  <code className="text-xs text-gray-500">font-light</code>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-2xl font-normal mb-1">Font Regular (400)</p>
                  <code className="text-xs text-gray-500">font-normal</code>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-2xl font-medium mb-1">Font Medium (500)</p>
                  <code className="text-xs text-gray-500">font-medium</code>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-2xl font-semibold mb-1">Font Semi Bold (600)</p>
                  <code className="text-xs text-gray-500">font-semibold</code>
                </div>
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold mb-1">Font Bold (700)</p>
                  <code className="text-xs text-gray-500">font-bold</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-card-title mb-6">Typography in Context</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Luxury Service Heading</h4>
                  <p className="text-base font-normal text-gray-600 mb-2">
                    Experience Switzerland's premier chauffeur service with our luxury fleet.
                  </p>
                  <p className="text-sm font-light text-gray-500">
                    Professional drivers, premium vehicles, exceptional service.
                  </p>
                </div>
                <div className="p-4 bg-primary-gold/10 rounded-lg border border-primary-gold/20">
                  <h4 className="text-xl font-bold text-primary-gold mb-2">Elite Way Promise</h4>
                  <p className="text-base font-medium text-gray-700">
                    Swiss precision meets luxury transportation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Hierarchy Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Typography Hierarchy</h2>
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-2 font-semibold text-gray-700 min-w-[200px]">Class</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700 min-w-[120px]">Mobile</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700 min-w-[120px]">Desktop</th>
                    <th className="text-left py-4 px-2 font-semibold text-gray-700 min-w-[200px]">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-hero</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">3rem (48px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">5rem (80px)</td>
                    <td className="py-4 px-2"><span className="text-hero">Elite Way</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-section-title</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.875rem (30px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">3rem (48px)</td>
                    <td className="py-4 px-2"><span className="text-section-title">Section Title</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-card-title</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.25rem (20px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.5rem (24px)</td>
                    <td className="py-4 px-2"><span className="text-card-title">Card Title</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-body-large</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.125rem (18px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.25rem (20px)</td>
                    <td className="py-4 px-2"><span className="text-body-large">Large body text</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-body</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">1rem (16px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">1.125rem (18px)</td>
                    <td className="py-4 px-2"><span className="text-body">Regular body text</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-caption</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">0.875rem (14px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">1rem (16px)</td>
                    <td className="py-4 px-2"><span className="text-caption">Caption text</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-2"><code className="text-sm bg-gray-100 px-2 py-1 rounded">text-micro</code></td>
                    <td className="py-4 px-2 text-sm text-gray-600">0.75rem (12px)</td>
                    <td className="py-4 px-2 text-sm text-gray-600">0.875rem (14px)</td>
                    <td className="py-4 px-2"><span className="text-micro">Micro text</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Button Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Button System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-card-title">Variants</h3>
              <div className="space-y-3">
                <Button variant="primary" className="w-full sm:w-auto">Primary Button</Button>
                <Button variant="secondary" className="w-full sm:w-auto">Secondary Button</Button>
                <Button variant="luxury" className="w-full sm:w-auto">Luxury Button</Button>
                <Button variant="outline" className="w-full sm:w-auto">Outline Button</Button>
                <Button variant="ghost" className="w-full sm:w-auto">Ghost Button</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-card-title">Sizes</h3>
              <div className="space-y-3">
                <Button size="sm" className="w-full sm:w-auto">Small</Button>
                <Button size="md" className="w-full sm:w-auto">Medium</Button>
                <Button size="lg" className="w-full sm:w-auto">Large</Button>
                <Button size="xl" className="w-full sm:w-auto">Extra Large</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-card-title">States</h3>
              <div className="space-y-3">
                <Button 
                  loading={loading} 
                  onClick={handleLoadingTest}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Loading...' : 'Test Loading State'}
                </Button>
                <Button disabled className="w-full sm:w-auto">Disabled Button</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Color System Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Color System</h2>
          
          {/* Primary Colors */}
          <div className="mb-8">
            <h3 className="text-card-title mb-4">Primary Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="space-sm bg-primary-gold text-white rounded-xl text-center">
                <p className="font-semibold text-sm sm:text-base">Primary Gold</p>
                <p className="text-xs opacity-90">#D4AF37</p>
              </div>
              <div className="space-sm bg-gold text-white rounded-xl text-center">
                <p className="font-semibold text-sm sm:text-base">Gold</p>
                <p className="text-xs opacity-90">#D4AF37</p>
              </div>
              <div className="space-sm bg-cream text-gray-800 rounded-xl text-center border border-gray-200">
                <p className="font-semibold text-sm sm:text-base">Cream</p>
                <p className="text-xs opacity-70">#E8E1D5</p>
              </div>
              <div className="space-sm bg-warm-gray text-gray-800 rounded-xl text-center">
                <p className="font-semibold text-sm sm:text-base">Warm Gray</p>
                <p className="text-xs opacity-70">#EBE5DD</p>
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div className="mb-8">
            <h3 className="text-card-title mb-4">Semantic Colors</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-sm bg-success text-white rounded-xl text-center">
                <p className="font-semibold">Success</p>
                <p className="text-xs opacity-90">#10B981</p>
              </div>
              <div className="space-sm bg-warning text-white rounded-xl text-center">
                <p className="font-semibold">Warning</p>
                <p className="text-xs opacity-90">#F59E0B</p>
              </div>
              <div className="space-sm bg-error text-white rounded-xl text-center">
                <p className="font-semibold">Error</p>
                <p className="text-xs opacity-90">#EF4444</p>
              </div>
              <div className="space-sm bg-info text-white rounded-xl text-center">
                <p className="font-semibold">Info</p>
                <p className="text-xs opacity-90">#3B82F6</p>
              </div>
            </div>
          </div>

          {/* Cream Scale */}
          <div>
            <h3 className="text-card-title mb-4">Cream Color Scale</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              <div className="aspect-square bg-cream-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-gray-800">50</p>
                <p className="text-xs text-gray-600">#FEFCF8</p>
              </div>
              <div className="aspect-square bg-cream-100 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-gray-800">100</p>
                <p className="text-xs text-gray-600">#F8F6F0</p>
              </div>
              <div className="aspect-square bg-cream-200 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-gray-800">200</p>
                <p className="text-xs text-gray-600">#F2EDE3</p>
              </div>
              <div className="aspect-square bg-cream-300 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-gray-800">300</p>
                <p className="text-xs text-gray-600">#E8E1D5</p>
              </div>
              <div className="aspect-square bg-cream-400 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-gray-800">400</p>
                <p className="text-xs text-gray-600">#DDD4C7</p>
              </div>
              <div className="aspect-square bg-cream-500 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-white">500</p>
                <p className="text-xs text-gray-200">#D4CAB8</p>
              </div>
              <div className="aspect-square bg-cream-600 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-white">600</p>
                <p className="text-xs text-gray-200">#C4B5A3</p>
              </div>
              <div className="aspect-square bg-cream-700 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-white">700</p>
                <p className="text-xs text-gray-200">#A89786</p>
              </div>
              <div className="aspect-square bg-cream-800 rounded-lg flex flex-col items-center justify-center p-2">
                <p className="text-xs font-medium text-white">800</p>
                <p className="text-xs text-gray-200">#8B7A6A</p>
              </div>
            </div>
          </div>
        </section>

        {/* Card System Showcase */}
        <section className="space-lg">
          <h2 className="text-section-title mb-8">Enhanced Card System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-base card-hover space-md">
              <h3 className="text-card-title mb-4">Standard Card</h3>
              <p className="text-body">This card uses the new card-base and card-hover classes for consistent styling and smooth interactions.</p>
              <div className="mt-4 text-micro text-gray-500">
                Classes: <code>card-base card-hover space-md</code>
              </div>
            </div>
            
            <div className="glass-effect space-md text-white rounded-2xl bg-gradient-to-br from-primary-gold/20 to-gray-700/20">
              <h3 className="text-card-title mb-4">Glass Effect Card</h3>
              <p className="text-body opacity-90">This card demonstrates the glass morphism effect with backdrop blur and gradient background.</p>
              <div className="mt-4 text-micro opacity-70">
                Classes: <code>glass-effect space-md</code>
              </div>
            </div>

            <div className="card-base space-md border-l-4 border-gold">
              <h3 className="text-card-title mb-4 text-gold">Accent Card</h3>
              <p className="text-body">Cards can be enhanced with accent colors and borders for visual hierarchy and importance.</p>
              <div className="mt-4 text-micro text-gray-500">
                Classes: <code>card-base space-md border-l-4 border-gold</code>
              </div>
            </div>
          </div>

          {/* Card Variations */}
          <div className="mt-8">
            <h3 className="text-card-title mb-6">Card Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="luxury-card space-md text-white">
                <h4 className="text-lg font-semibold mb-3 text-luxury-text">Luxury Card</h4>
                <p className="text-body opacity-90">Dark themed card for premium content with luxury styling.</p>
                <div className="mt-4 text-micro opacity-60">
                  Classes: <code>luxury-card space-md</code>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cream-100 to-cream-200 space-md rounded-2xl border border-cream-300">
                <h4 className="text-lg font-semibold mb-3 text-gray-800">Gradient Card</h4>
                <p className="text-body text-gray-700">Subtle gradient background using the cream color scale.</p>
                <div className="mt-4 text-micro text-gray-600">
                  Custom gradient: <code>from-cream-100 to-cream-200</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacing System Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">8-Point Spacing System</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-card-title mb-4">Spacing Classes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono">space-xs</div>
                  <div className="bg-primary-gold/20 rounded" style={{padding: '8px'}}>8px</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono">space-sm</div>
                  <div className="bg-primary-gold/20 rounded" style={{padding: '16px'}}>16px</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono">space-md</div>
                  <div className="bg-primary-gold/20 rounded" style={{padding: '24px'}}>24px</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono">space-lg</div>
                  <div className="bg-primary-gold/20 rounded" style={{padding: '32px'}}>32px</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 text-sm font-mono">space-xl</div>
                  <div className="bg-primary-gold/20 rounded" style={{padding: '48px'}}>48px</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-card-title mb-4">Mobile Touch Targets</h3>
              <div className="space-y-4">
                <div className="mobile-touch-target bg-primary-gold/10 rounded-lg flex items-center justify-center border border-primary-gold/20">
                  <span className="text-sm">44px minimum touch target</span>
                </div>
                <p className="text-body text-gray-600">
                  All interactive elements use the <code className="bg-gray-100 px-1 rounded">mobile-touch-target</code> class 
                  to ensure accessibility on mobile devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* State Feedback Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced State Feedback</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-card-title mb-4">Feedback Messages</h3>
              <div className="space-y-4">
                <div className="feedback-success">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Reservation confirmed successfully!</span>
                </div>
                
                <div className="feedback-warning">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Please verify your pickup location</span>
                </div>
                
                <div className="feedback-error">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Route calculation failed. Please try again.</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-card-title mb-4">Form States</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Success state" 
                  className="form-success w-full px-4 py-3 rounded-lg" 
                  value="Valid input" 
                  readOnly 
                />
                <input 
                  type="text" 
                  placeholder="Warning state" 
                  className="form-warning w-full px-4 py-3 rounded-lg" 
                  value="Check this input" 
                  readOnly 
                />
                <input 
                  type="text" 
                  placeholder="Error state" 
                  className="form-error w-full px-4 py-3 rounded-lg" 
                  value="Invalid input" 
                  readOnly 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Enhanced Animations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-card-title mb-4">Entrance Animations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-primary-gold/10 rounded-lg animate-fadeIn border border-primary-gold/20">
                  <span className="font-medium">Fade In Animation</span>
                  <code className="block text-xs text-gray-600 mt-1">animate-fadeIn</code>
                </div>
                <div className="p-4 bg-gold/10 rounded-lg animate-fadeInUp border border-gold/20">
                  <span className="font-medium">Fade In Up Animation</span>
                  <code className="block text-xs text-gray-600 mt-1">animate-fadeInUp</code>
                </div>
                <div className="p-4 bg-success/10 rounded-lg animate-scaleIn border border-success/20">
                  <span className="font-medium">Scale In Animation</span>
                  <code className="block text-xs text-gray-600 mt-1">animate-scaleIn</code>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-card-title mb-4">Interactive Animations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-primary-gold/10 rounded-lg hover:animate-float transition-all duration-300 cursor-pointer border border-primary-gold/20">
                  <span className="font-medium">Hover for Float Effect</span>
                  <code className="block text-xs text-gray-600 mt-1">hover:animate-float</code>
                </div>
                <div className="p-4 bg-gold/10 rounded-lg animate-blob border border-gold/20">
                  <span className="font-medium">Blob Animation</span>
                  <code className="block text-xs text-gray-600 mt-1">animate-blob</code>
                </div>
                <div className="p-4 bg-info/10 rounded-lg animate-pulse border border-info/20">
                  <span className="font-medium">Pulse Animation</span>
                  <code className="block text-xs text-gray-600 mt-1">animate-pulse</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Design Showcase */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Responsive Design Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-card-title mb-4">Breakpoints</h3>
              <div className="space-y-3">
                <div className="p-3 bg-cream-100 rounded-lg border border-cream-200">
                  <div className="font-medium text-sm">Small (sm)</div>
                  <div className="text-xs text-gray-600">30em (480px) and up</div>
                </div>
                <div className="p-3 bg-cream-100 rounded-lg border border-cream-200">
                  <div className="font-medium text-sm">Medium (md)</div>
                  <div className="text-xs text-gray-600">50em (800px) and up</div>
                </div>
                <div className="p-3 bg-cream-100 rounded-lg border border-cream-200">
                  <div className="font-medium text-sm">Large (lg)</div>
                  <div className="text-xs text-gray-600">70em (1120px) and up</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-card-title mb-4">Mobile Optimization</h3>
              <div className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="font-medium text-sm text-success-dark">✓ Touch-friendly targets (44px min)</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="font-medium text-sm text-success-dark">✓ Readable font sizes on mobile</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="font-medium text-sm text-success-dark">✓ Responsive grid layouts</div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                  <div className="font-medium text-sm text-success-dark">✓ Mobile-first design approach</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Component Documentation */}
        <section className="card-base space-lg">
          <h2 className="text-section-title mb-8">Component Documentation</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-info/5 to-info/10 rounded-lg p-6 border border-info/20">
              <h3 className="text-card-title mb-4 text-info-dark">Usage Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-body">
                <div>
                  <h4 className="font-semibold mb-2">Typography</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Use <code>text-hero</code> for main page headings</li>
                    <li>• Use <code>text-section-title</code> for section headers</li>
                    <li>• Use <code>text-card-title</code> for card and component titles</li>
                    <li>• Use <code>text-body</code> for regular content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Layout</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Use spacing classes for consistent padding</li>
                    <li>• Apply <code>card-base</code> for content containers</li>
                    <li>• Add <code>card-hover</code> for interactive cards</li>
                    <li>• Use mobile-first responsive design</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-warning/5 to-warning/10 rounded-lg p-6 border border-warning/20">
              <h3 className="text-card-title mb-4 text-warning-dark">Accessibility Notes</h3>
              <div className="text-body space-y-2">
                <p>• All interactive elements meet WCAG 2.1 AA standards for touch targets</p>
                <p>• Color combinations provide sufficient contrast ratios</p>
                <p>• Font sizes are optimized for readability across devices</p>
                <p>• Animation respects <code>prefers-reduced-motion</code> settings</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
