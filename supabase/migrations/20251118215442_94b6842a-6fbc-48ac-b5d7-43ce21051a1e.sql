-- Remove the policy that allows authenticated users to view contact submissions
DROP POLICY "Authenticated users can view submissions" ON public.contact_submissions;