import { Link } from "react-router-dom";
import Button from "../../components/Button";

const PrototypeNavigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-gray to-cream-light flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Homepage Prototypes
          </h1>
          <p className="text-gray-600 text-lg">
            Choose a prototype to preview different layout designs
          </p>
        </div>

        <div className="space-y-6">
          {/* Prototype 1 - Horizontal Bar */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Horizontal Reservation Bar
            </h3>
            <p className="text-gray-600 mb-4">
              Full-width banner image with horizontal reservation form at the bottom. 
              Clean, minimal design focused on the booking experience.
            </p>
            <Link to="/prototype-horizontal">
              <Button variant="primary" className="w-full">
                View Horizontal Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 2 - Centered Overlay */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Centered Overlay Design
            </h3>
            <p className="text-gray-600 mb-4">
              Full-screen banner with centered reservation card overlay. 
              Elegant glass-morphism effect with prominent booking form.
            </p>
            <Link to="/prototype-centered">
              <Button variant="primary" className="w-full">
                View Centered Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 3 - Split Screen */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Split Screen Layout
            </h3>
            <p className="text-gray-600 mb-4">
              Modern split-screen design with image on left and booking form on right. 
              Perfect balance between visual impact and form usability.
            </p>
            <Link to="/prototype-split">
              <Button variant="primary" className="w-full">
                View Split Screen Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 4 - Split Screen Vertical */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Split Screen Vertical (Alternative)
            </h3>
            <p className="text-gray-600 mb-4">
              Alternative split-screen with form on left, image on right. 
              Enhanced styling with detailed form design and elegant image overlay.
            </p>
            <Link to="/prototype-split-vertical">
              <Button variant="primary" className="w-full">
                View Split Vertical Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 5 - Hybrid */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Hybrid Design (Horizontal + Centered)
            </h3>
            <p className="text-gray-600 mb-4">
              Combines centered title with horizontal form layout. 
              Full-screen banner with centered content and horizontal reservation inputs.
            </p>
            <Link to="/prototype-hybrid">
              <Button variant="primary" className="w-full">
                View Hybrid Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 6 - Floating Card */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Floating Card Design
            </h3>
            <p className="text-gray-600 mb-4">
              Floating reservation card at the bottom with animated background elements. 
              Modern gradient effects and enhanced visual appeal.
            </p>
            <Link to="/prototype-floating">
              <Button variant="primary" className="w-full">
                View Floating Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 7 - Sidebar Layout */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sidebar Layout
            </h3>
            <p className="text-gray-600 mb-4">
              Split layout with full-height image on left and reservation form in right sidebar. 
              Professional and focused booking experience.
            </p>
            <Link to="/prototype-sidebar">
              <Button variant="primary" className="w-full">
                View Sidebar Prototype
              </Button>
            </Link>
          </div>

          {/* Prototype 8 - Sidebar Full Image */}
          <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Sidebar Full Image
            </h3>
            <p className="text-gray-600 mb-4">
              Full-page background image with sidebar form overlay. 
              Image spans entire page including behind the form for immersive experience.
            </p>
            <Link to="/prototype-sidebar-full">
              <Button variant="primary" className="w-full">
                View Sidebar Full Image
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-royal-blue hover:text-royal-blue-dark transition-colors">
            ← Back to Original Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrototypeNavigation;
