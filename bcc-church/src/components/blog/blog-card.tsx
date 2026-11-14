import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Facebook } from "lucide-react";
import type { BlogPost } from "@/lib/schemas";
import { resolveUploadUrl } from "@/utilities/Endpoints";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

function coverOf(post: BlogPost, fallback: string): string {
  return resolveUploadUrl(post.images?.[0] ?? post.imageUrl) ?? fallback;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <Card className="shadow-xl overflow-hidden mb-12 card-hover group">
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative overflow-hidden">
            <img
              src={coverOf(post, 'https://images.unsplash.com/photo-1507692049790-de58290a4334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500')}
              alt={post.title}
              loading="lazy"
              className="w-full h-80 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid={`img-featured-post-${post.id}`}
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-accent text-accent-foreground" data-testid="badge-featured">Featured</Badge>
            </div>
          </div>
          <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center mb-4">
              <Badge variant="outline" className="text-accent border-accent" data-testid={`badge-category-${post.id}`}>
                {post.category}
              </Badge>
              {post.source === "facebook" && (
                <Badge className="ml-2 bg-[#1877F2] text-white" data-testid={`badge-source-${post.id}`}>
                  <Facebook size={12} className="mr-1" /> Facebook
                </Badge>
              )}
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground text-sm flex items-center" data-testid={`text-date-${post.id}`}>
                <Calendar size={14} className="mr-1" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4 font-serif" data-testid={`text-title-${post.id}`}>
              {post.title}
            </h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed" data-testid={`text-excerpt-${post.id}`}>
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
                  alt={post.author}
                  className="w-10 h-10 rounded-full mr-3"
                  data-testid={`img-author-${post.id}`}
                />
                <div>
                  <p className="font-medium text-primary" data-testid={`text-author-${post.id}`}>{post.author}</p>
                  <p className="text-sm text-muted-foreground">Church Leadership</p>
                </div>
              </div>
              <Button variant="ghost" className="text-accent hover:text-accent/80" data-testid={`button-read-more-${post.id}`}>
                Read More <ArrowRight size={16} className="ml-1" />
              </Button>
              {post.sourceUrl && (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-sm font-semibold text-[#1877F2] hover:underline"
                  data-testid={`link-source-${post.id}`}
                >
                  <Facebook size={14} className="mr-1" /> View original
                </a>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg overflow-hidden card-hover group h-full" data-testid={`card-post-${post.id}`}>
      <div className="overflow-hidden">
        <img
          src={coverOf(post, 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300')}
          alt={post.title}
          loading="lazy"
          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          data-testid={`img-post-${post.id}`}
        />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <Badge variant="outline" className="text-accent border-accent" data-testid={`badge-category-${post.id}`}>
            {post.category}
          </Badge>
          {post.source === "facebook" && (
            <Badge className="ml-2 bg-[#1877F2] text-white" data-testid={`badge-source-${post.id}`}>
              <Facebook size={12} className="mr-1" /> Facebook
            </Badge>
          )}
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-muted-foreground text-sm flex items-center" data-testid={`text-date-${post.id}`}>
            <Calendar size={12} className="mr-1" />
            {formatDate(post.createdAt)}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-3 font-serif" data-testid={`text-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed" data-testid={`text-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
        <Button variant="ghost" className="text-accent hover:text-accent/80 text-sm p-0" data-testid={`button-read-more-${post.id}`}>
          Read More <ArrowRight size={14} className="ml-1" />
        </Button>
        {post.sourceUrl && (
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center text-sm font-semibold text-[#1877F2] hover:underline"
            data-testid={`link-source-${post.id}`}
          >
            <Facebook size={14} className="mr-1" /> View original
          </a>
        )}
      </CardContent>
    </Card>
  );
}
