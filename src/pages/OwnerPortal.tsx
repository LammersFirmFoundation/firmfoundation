import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Users, Wrench, TrendingUp, Calendar, FileText } from "lucide-react";

const OwnerPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Owner Portal Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="owner@example.com" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="mt-2" />
              </div>
              <Button className="w-full" onClick={() => setIsLoggedIn(true)}>
                Sign In
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                New owner? Contact us to set up your account.
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
            <h1 className="text-3xl md:text-4xl font-bold">Owner Portal</h1>
            <p className="text-muted-foreground mt-2">Welcome back, Sarah Smith</p>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <DollarSign className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Monthly Income</h3>
                      <p className="text-2xl font-bold">$2,400</p>
                      <p className="text-sm text-green-600">+100% occupied</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Users className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Occupancy</h3>
                      <p className="text-2xl font-bold">100%</p>
                      <p className="text-sm text-muted-foreground">1/1 units rented</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <Wrench className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Maintenance</h3>
                      <p className="text-2xl font-bold">$150</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <TrendingUp className="h-8 w-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Net Income</h3>
                      <p className="text-2xl font-bold">$2,250</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border border-border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Modern Belle Hall Townhouse</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            123 Belle Hall Pkwy, Mount Pleasant, SC
                          </p>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rent:</span>
                            <span className="font-semibold">$2,400/mo</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="text-green-600 font-semibold">Occupied</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Lease Ends:</span>
                            <span className="font-semibold">Dec 31, 2025</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 pb-3 border-b border-border">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Rent Payment Received</p>
                            <p className="text-xs text-muted-foreground">Nov 1, 2024 - $2,400</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 pb-3 border-b border-border">
                          <Wrench className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Maintenance Completed</p>
                            <p className="text-xs text-muted-foreground">Oct 28, 2024 - Kitchen faucet repair</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Monthly Report Available</p>
                            <p className="text-xs text-muted-foreground">Oct 30, 2024</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="financials">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Income & Expenses Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="font-semibold">Rental Income</span>
                          <span className="text-green-600 font-semibold">+$2,400</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">Management Fee (8%)</span>
                          <span className="text-red-600">-$192</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">Maintenance</span>
                          <span className="text-red-600">-$150</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="text-muted-foreground">Insurance</span>
                          <span className="text-red-600">-$125</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 text-lg">
                          <span className="font-bold">Net Income</span>
                          <span className="font-bold text-primary">$1,933</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { month: "Nov 2024", amount: "$1,933" },
                          { month: "Oct 2024", amount: "$2,150" },
                          { month: "Sep 2024", amount: "$1,890" },
                          { month: "Aug 2024", amount: "$2,100" },
                        ].map((payment, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-border">
                            <span>{payment.month}</span>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">{payment.amount}</span>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Kitchen Faucet Repair</h4>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Completed Oct 28, 2024</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-semibold">$150</span>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Annual HVAC Service</h4>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Completed Sep 15, 2024</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-semibold">$200</span>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">Landscaping Service</h4>
                          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Completed Aug 20, 2024</p>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-semibold">$120</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Monthly Statement - Nov 2024",
                        "Tenant Lease Agreement - Current",
                        "Property Insurance Policy",
                        "Annual Tax Documents - 2024",
                        "Maintenance Reports - 2024",
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <span>{doc}</span>
                          </div>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OwnerPortal;
