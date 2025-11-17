import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, CreditCard, Wrench } from "lucide-react";

const TenantPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Client Portal Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="mt-2" />
              </div>
              <Button className="w-full" onClick={() => setIsLoggedIn(true)}>
                Sign In
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account? Contact your property manager.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-8 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Client Portal</h1>
            <p className="text-muted-foreground mt-2">Welcome back, John Doe</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="rent">Rent Payment</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <FileText className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Lease Status</h3>
                      <p className="text-2xl font-bold">Active</p>
                      <p className="text-sm text-muted-foreground">Expires Dec 31, 2025</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <CreditCard className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Rent Due</h3>
                      <p className="text-2xl font-bold">$2,400</p>
                      <p className="text-sm text-muted-foreground">Due Dec 1, 2024</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Wrench className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Open Requests</h3>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                    </CardContent>
                  </Card>

                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-semibold">Modern Belle Hall Townhouse</p>
                      <p className="text-muted-foreground">123 Belle Hall Pkwy, Mount Pleasant, SC 29464</p>
                      <p className="text-muted-foreground">3 Bed | 2.5 Bath | 1,850 sqft</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rent">
                <Card>
                  <CardHeader>
                    <CardTitle>Pay Rent</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-muted/50 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Amount Due</span>
                        <span className="text-3xl font-bold text-primary">$2,400</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Due Date: December 1, 2024</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Input id="payment-method" value="Bank Account ****1234" disabled className="mt-2" />
                      </div>
                      <Button className="w-full" size="lg">
                        Pay $2,400
                      </Button>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Payment History</h3>
                      <div className="space-y-3">
                        {["Nov 2024 - $2,400", "Oct 2024 - $2,400", "Sep 2024 - $2,400"].map((payment, i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-border">
                            <span>{payment}</span>
                            <span className="text-green-600 font-semibold">Paid</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submit Maintenance Request</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="issue-type">Issue Type</Label>
                        <Input id="issue-type" placeholder="e.g., Plumbing, Electrical, HVAC" className="mt-2" />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Please describe the issue in detail..."
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="urgency">Urgency</Label>
                        <Input id="urgency" placeholder="Low, Medium, High" className="mt-2" />
                      </div>
                      <Button className="w-full">Submit Request</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold">Kitchen Faucet Leak</h4>
                            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">In Progress</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Submitted Nov 15, 2024
                          </p>
                          <p className="text-sm">
                            Technician scheduled for Nov 20, 2024 between 9am-12pm
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TenantPortal;
