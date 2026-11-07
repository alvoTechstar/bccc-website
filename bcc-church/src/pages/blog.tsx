import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blog/blog-card";
import { Search } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { PageHero } from "@/components/motion/page-hero";
import { Reveal, SectionHeading, Counter } from "@/components/motion/reveal";
import { staggerContainer, staggerDir } from "@/lib/animations";

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Posts");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: allPosts = [], isLoading } = useQuery<BlogPost[]>({
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

  return (
    <div>
      <PageHero
        title={<>Church <span className="gold-accent">Blog</span></>}
        description="Stay connected with inspiring stories, biblical teachings, testimonies, and updates from our church community across Kenya."
      />

      {/* Search and Categories */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <Reveal className="max-w-4xl mx-auto">
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search articles, authors, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-background shadow-sm focus-visible:ring-accent"
                data-testid="input-blog-search"
              />
            </div>

            <motion.div layout className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.span key={category} layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
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
                </motion.span>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Featured Post */}
      <AnimatePresence mode="wait">
        {(featuredPost || isLoading) && (
          <motion.section
            key={selectedCategory + searchTerm + "featured"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="py-16 bg-background"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <SectionHeading
                  eyebrow="Spotlight"
                  title={<>Featured <span className="gold-accent">Article</span></>}
                />
                {isLoading ? (
                  <Card className="shadow-xl overflow-hidden mb-12">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <Skeleton className="w-full h-80" />
                      <div className="p-8 lg:p-12 space-y-4">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  </Card>
                ) : featuredPost ? (
                  <Reveal from="rotate-l">
                    <BlogCard post={featuredPost} featured={true} />
                  </Reveal>
                ) : null}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Regular Posts */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {regularPosts.length > 0 ? (
              <>
                <SectionHeading
                  eyebrow="Browse"
                  title={<>Latest <span className="gold-accent">Posts</span></>}
                  description={
                    selectedCategory !== "All Posts"
                      ? `Showing ${regularPosts.length} posts in "${selectedCategory}"`
                      : `Showing ${regularPosts.length} recent posts`
                  }
                />

                <motion.div
                  layout
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: "-60px" }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {isLoading
                      ? [0, 1, 2].map((i) => (
                          <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-6 space-y-3">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-6 w-full" />
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                          </Card>
                        ))
                      : regularPosts.map((post, i) => (
                          <motion.div
                            key={post.id}
                            layout
                            variants={staggerDir(i)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35 }}
                          >
                            <BlogCard post={post} />
                          </motion.div>
                        ))}
                  </AnimatePresence>
                </motion.div>
              </>
            ) : (
              !isLoading && (
                <Reveal className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <motion.div
                      animate={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5 }}
                      className="w-24 h-24 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <Search className="text-accent" size={32} />
                    </motion.div>
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
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-royal relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-blob absolute -top-16 left-1/3 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal from="down">
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-white">
                Stay <span className="gold-accent">Connected</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} from="left">
              <p className="text-xl text-gray-200 mb-8">
                Subscribe to our newsletter and never miss the latest updates, testimonies,
                and inspiring content from BCC Church.
              </p>
            </Reveal>
            <Reveal delay={0.18} from="right">
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                  data-testid="input-newsletter-email"
                />
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="btn-shine bg-accent text-accent-foreground hover:bg-accent/90"
                    data-testid="button-newsletter-subscribe"
                  >
                    Subscribe
                  </Button>
                </motion.span>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="text-sm text-gray-300 mt-4">
                Join <Counter to={500} suffix="+" /> subscribers who receive weekly inspiration and church updates.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Blog Statistics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="grid md:grid-cols-4 gap-8 text-center"
          >
            {[
              { n: allPosts.length, s: "+", label: "Published Articles", id: "total-posts" },
              { n: categories.length - 1, s: "", label: "Categories", id: "categories" },
              { n: 5, s: "+", label: "Contributing Authors", id: "authors" },
              { n: 1000, s: "+", label: "Monthly Readers", id: "readers" },
            ].map((stat, i) => (
              <motion.div key={stat.id} variants={staggerDir(i)}>
                <div className="text-4xl font-bold text-accent mb-2 font-serif" data-testid={`text-stat-${stat.id}`}>
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
