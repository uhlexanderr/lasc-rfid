import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Do not show breadcrumb on home page
  if (location.pathname === '/') return null;

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');

    if (pathSegments.length === 0) return [];

    const breadcrumbItems = [{ name: 'Home', path: '/', active: false }];
    let currentPath = '';

    pathSegments.forEach((segment, index) => {
      if (segment === 'edit' || segment === 'view') return;

      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      let name = segment;
      if (segment === 'Register') name = 'Register';
      else if (segment === 'Login') name = 'Login';
      else if (segment === 'AddData') name = 'Add New Student';
      else if (segment === 'adddata') name = 'Add New Student';
      else if (segment === 'EditData') name = 'Edit Data';
      else if (segment === 'ViewData') name = 'View Data';
      else if (segment === 'archives') name = 'Archives';
      else if (/^[0-9a-fA-F]{24}$/.test(segment)) {
        const isEditContext = pathSegments.includes('edit') || pathSegments.includes('EditData');
        name = isEditContext ? 'Edit Student Details' : 'Student Details';
      } else {
        name = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      breadcrumbItems.push({
        name,
        path: currentPath,
        active: isLast
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();
  if (breadcrumbItems.length === 0) return null;

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <style>{`
        .back-arrow {
          border: none;
          background: none;
          font-size: 2rem;
          padding: 0.25rem 0.5rem;
          color: #333;
          transition: color 0.2s ease;
        }
        .back-arrow:hover {
          color: #000;
        }
      `}</style>

      <nav aria-label="breadcrumb" className="mt-3 mb-3">
        <div className="container">
          <div className="d-flex align-items-center">
            <button 
              onClick={handleBackClick}
              className="btn back-arrow me-3"
              title="Go back"
            >
              ←
            </button>
            <ol className="breadcrumb mb-0">
              {breadcrumbItems.map((item, index) => (
                <li 
                  key={index} 
                  className={`breadcrumb-item ${item.active ? 'active' : ''}`}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {item.active ? (
                    item.name
                  ) : (
                    <Link to={item.path} className="text-decoration-none">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumb;