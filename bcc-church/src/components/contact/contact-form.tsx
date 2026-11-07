import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Send } from "lucide-react";
import { site } from "@/lib/site";
import type { InsertContactMessage } from "@/lib/schemas";

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertContactMessage>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    newsletter: false
  });

  const createContactMessage = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", `${site.apiBase}/api/contact`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        newsletter: false
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createContactMessage.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertContactMessage, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-xl">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-primary mb-6 font-serif" data-testid="text-contact-form-title">Send Us a Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="block text-sm font-medium text-primary mb-2">
                First Name *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                data-testid="input-first-name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="block text-sm font-medium text-primary mb-2">
                Last Name *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                data-testid="input-last-name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              data-testid="input-email"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              data-testid="input-phone"
            />
          </div>

          <div>
            <Label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
              Subject *
            </Label>
            <Select onValueChange={(value) => handleInputChange("subject", value)} data-testid="select-subject">
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prayer Request">Prayer Request</SelectItem>
                <SelectItem value="Join Church Membership">Join Church Membership</SelectItem>
                <SelectItem value="Ministry Inquiry">Ministry Inquiry</SelectItem>
                <SelectItem value="General Question">General Question</SelectItem>
                <SelectItem value="Event Information">Event Information</SelectItem>
                <SelectItem value="Pastoral Counseling">Pastoral Counseling</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
              Message *
            </Label>
            <Textarea
              id="message"
              rows={5}
              placeholder="Please share your message, prayer request, or question with us..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              data-testid="textarea-message"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) => handleInputChange("newsletter", !!checked)}
              data-testid="checkbox-newsletter"
            />
            <Label htmlFor="newsletter" className="text-sm text-muted-foreground">
              I would like to receive updates about church events and news
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={createContactMessage.isPending}
            data-testid="button-submit-contact"
          >
            <Send className="mr-2" size={20} />
            {createContactMessage.isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
