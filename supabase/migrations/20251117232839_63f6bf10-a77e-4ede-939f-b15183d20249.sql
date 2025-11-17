-- Criar Storage Bucket para vídeos de aulas
INSERT INTO storage.buckets (id, name, public)
VALUES ('instructor-videos', 'instructor-videos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Instrutores podem fazer upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'instructor-videos' AND
    (has_role(auth.uid(), 'instrutor') OR has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Instrutores podem ver próprios vídeos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'instructor-videos' AND
    (auth.uid()::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Admin/Gestor podem ver todos vídeos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'instructor-videos' AND
    (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'gestor'))
  );