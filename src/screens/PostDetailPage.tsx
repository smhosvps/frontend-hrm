// src/pages/PostDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPostByIdQuery } from "@/redux/features/blogApi/blogApi";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowLeft,
  Heart,
  BookOpen,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";
import Helmet from "react-helmet"

// Map icon strings to actual components
const iconMap = {
  BookOpen,
  Heart,
  Users,
};

// Related posts data structure
interface RelatedPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useGetPostByIdQuery(id || "");
  const [currentImage, setCurrentImage] = useState(0);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);

  console.log(relatedPosts)

  // Generate structured data for SEO
  const generateStructuredData = () => {
    if (!post) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "headline": post.title,
      "description": post.excerpt,
      "image": post.image?.url || "",
      "author": {
        "@type": "Organization",
        "name": "Salvation Ministries Children's Ministry",
        "url": "https://www.smhos.org"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Salvation Ministries",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.salvationministries.org/logo.png"
        }
      },
      "datePublished": post.date,
      "dateModified": post.date
    };
  };

  // Simulate fetching related posts
  useEffect(() => {
    if (post) {
      const mockRelated = [
        {
          id: "1",
          title: "Building Character Through Service Projects",
          category: "Character Building",
          date: "2024-03-10",
          excerpt: "Learn how involving children in community service helps develop compassion and empathy.",
        },
        {
          id: "2",
          title: "Age-Appropriate Ways to Discuss Faith",
          category: "Parenting Tips",
          date: "2024-02-28",
          excerpt: "A parent's guide to talking about God and faith concepts children can understand.",
        },
        {
          id: "3",
          title: "Summer Activities That Strengthen Faith",
          category: "Seasonal Activities",
          date: "2024-02-15",
          excerpt: "Fun, faith-based activities to keep children engaged in their spiritual growth.",
        },
      ];
      setRelatedPosts(mockRelated);
    }
  }, [post]);

  const nextImage = () => {
    if (post?.images) {
      setCurrentImage((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post?.images) {
      setCurrentImage(
        (prev) => (prev - 1 + post.images.length) % post.images.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-xl font-bold text-blue-900">
            Loading Ministry Wisdom
          </h1>
          <p className="text-gray-600 mt-2">
            Preparing this inspiring content for you...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <div role="alert" aria-live="assertive">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">!</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Content Unavailable
            </h1>
            <p className="text-gray-600 mb-6">
              We couldn't find the post you're looking for. It may have been moved
              or deleted.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={refetch}
              aria-label="Try loading again"
            >
              Try Again
            </Button>
            <Link to="/blog">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600"
                aria-label="Go back to blog"
              >
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[post.icon as keyof typeof iconMap] || BookOpen;
  const formattedDate = format(new Date(post.date), "MMMM d, yyyy");
  const structuredData = generateStructuredData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* SEO Metadata */}
      <Helmet>
        <title>{post.title} | Salvation Ministries Children's Ministry</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`children ministry, christian education, ${post.category}, salvation ministries`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image?.url || "https://www.salvationministries.org/default-image.jpg"} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Navigation Bar */}
      <nav className="bg-blue-900 text-white py-4 px-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <Link
            to="/blog"
            className="flex items-center hover:text-blue-200 transition-colors"
            aria-label="Go back to blog"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-12 px-4 bg-gradient-to-br from-blue-800 to-blue-900 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center bg-blue-700 px-4 py-1 rounded-full mb-4">
              <IconComponent className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="font-medium">{post.category}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center text-blue-200">
              <Calendar className="w-5 h-5 mr-2" aria-hidden="true" />
              <time dateTime={post.date}>{formattedDate}</time>
            </div>

          </div>
        </div>
      </header>

      {/* Featured Image */}
      <section className="py-8 px-4" aria-label="Post image gallery">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-xl overflow-hidden shadow-xl">
            {post.image ? (
              <img
                src={post.image.url}
                alt={post.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            ) : (
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-full h-96 flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-blue-600 opacity-50" aria-hidden="true" />
              </div>
            )}

            {post.images && post.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {post.images.map((_: any, idx: any) => (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full ${
                        currentImage === idx ? "bg-white" : "bg-white/50"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main>
        <article className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <p className="text-xl text-blue-900 font-medium mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="space-y-6">
              <div 
                className="prose max-w-none mb-8 leading-7"
                dangerouslySetInnerHTML={{ __html: post?.content }}
              />
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-blue-100">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 flex-shrink-0">
                  <img
                    className="rounded-md"
                    src="https://pbs.twimg.com/profile_images/1537490359869222913/diZXxwqZ_400x400.jpg"
                    alt="Salvation Ministries Logo"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-2">
                    Join Us
                  </h2>
                  <p className="text-gray-700 mb-4">
                    At Salvation Ministries, our foundation is Christ, the
                    Solid Rock. We maintain the values of love, faith, fellowship
                    and impact, which are exhibited in everything we do.
                    Currently, our services and programs are being transmitted in
                    English, French, Spanish, Arabic, German, Italian, Portuguese,
                    and indigenous Nigerian languages. We invite you to join us,
                    irrespective of your sociocultural background. You can worship
                    with us in any of our churches around the world, or online via
                    our streaming platforms. <br/><br/>We have three fellowship structures:
                    home fellowship (for homes), unique fellowship (for students),
                    and corporate fellowship (for offices and business places).
                    These exist to cater to the spiritual and welfare needs of
                    individuals at a more intimate level. In your quest for a
                    deeper relationship with God and a stronger connection with
                    other believers, belonging to a fellowship is important.
                    Locate a fellowship today.
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://smhos.org/" aria-label="Visit Salvation Ministries official website">
                      <Button
                        variant="outline"
                        className="border-blue-600 text-blue-600"
                      >
                        Visit SMHOS
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}