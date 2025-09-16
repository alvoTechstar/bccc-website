import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blog/blog-card";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: allPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog/posts");
      return response.json();
    },
  });

  const categories = [
    "All Posts",
    "Spiritual Growth", 
    "Community Outreach", 
    "Youth Ministry", 
    "Church Development", 
    "Worship Ministry", 
    "Women's Ministry", 
    "Leadership Training"
  ];

  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold font-serif mb-6 text-white">
            Church <span className="gold-accent">Blog</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Stay connected with inspiring stories, biblical teachings, testimonies, and updates 
            from our church community across Kenya.
          </p>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg"
                data-testid="input-blog-search"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-accent text-accent-foreground hover:bg-accent/90" 
                    : "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  }
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                  Featured <span className="gold-accent">Article</span>
                </h2>
              </div>
              <BlogCard post={featuredPost} featured={true} />
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {regularPosts.length > 0 ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-primary">
                    Latest <span className="gold-accent">Posts</span>
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    {selectedCategory !== "All Posts" 
                      ? `Showing ${regularPosts.length} posts in "${selectedCategory}"`
                      : `Showing ${regularPosts.length} recent posts`
                    }
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-muted-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="text-muted-foreground" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">No Posts Found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? `No posts match your search for "${searchTerm}"`
                      : `No posts found in the "${selectedCategory}" category`
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All Posts");
                    }}
                    data-testid="button-clear-filters"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
              Stay <span className="gold-accent">Connected</span>
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Subscribe to our newsletter and never miss the latest updates, testimonies, 
              and inspiring content from BCC Church.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                data-testid="input-newsletter-email"
              />
              <Button 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-300 mt-4">
              Join 500+ subscribers who receive weekly inspiration and church updates.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Statistics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-total-posts">
                {allPosts.length}+
              </div>
              <p className="text-muted-foreground">Published Articles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-categories">
                {categories.length - 1}
              </div>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-authors">5+</div>
              <p className="text-muted-foreground">Contributing Authors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2" data-testid="text-stat-readers">1000+</div>
              <p className="text-muted-foreground">Monthly Readers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
