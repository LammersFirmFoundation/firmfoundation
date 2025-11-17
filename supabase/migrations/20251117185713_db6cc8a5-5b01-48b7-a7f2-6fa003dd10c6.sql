-- Link clients to user accounts
ALTER TABLE public.clients ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create invoices table for billing
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  invoice_number text NOT NULL UNIQUE,
  amount decimal(10,2) NOT NULL,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own invoices"
  ON public.invoices FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoices"
  ON public.invoices FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create payments table
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_date date NOT NULL DEFAULT CURRENT_DATE,
  payment_method text,
  transaction_id text,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own payments"
  ON public.payments FOR SELECT
  USING (
    invoice_id IN (
      SELECT i.id FROM public.invoices i
      JOIN public.clients c ON i.client_id = c.id
      WHERE c.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all payments"
  ON public.payments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create maintenance requests table
CREATE TABLE public.maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  category text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own maintenance requests"
  ON public.maintenance_requests FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create their own maintenance requests"
  ON public.maintenance_requests FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all maintenance requests"
  ON public.maintenance_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create lease agreements table
CREATE TABLE public.lease_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  monthly_rent decimal(10,2) NOT NULL,
  security_deposit decimal(10,2),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'terminated')),
  terms text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.lease_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own lease agreements"
  ON public.lease_agreements FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lease agreements"
  ON public.lease_agreements FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create documents table
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  category text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own documents"
  ON public.documents FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all documents"
  ON public.documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_requests_updated_at
  BEFORE UPDATE ON public.maintenance_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lease_agreements_updated_at
  BEFORE UPDATE ON public.lease_agreements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();