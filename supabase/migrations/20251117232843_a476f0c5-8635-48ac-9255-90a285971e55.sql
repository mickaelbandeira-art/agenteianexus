-- Atualizar função handle_new_user para incluir CPF e criar role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  perfil_tipo TEXT;
BEGIN
  -- Inserir perfil
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    matricula,
    cpf,
    cargo
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'matricula',
    new.raw_user_meta_data->>'cpf',
    new.raw_user_meta_data->>'cargo'
  );
  
  -- Criar role baseada no tipo de perfil
  perfil_tipo := new.raw_user_meta_data->>'perfil_tipo';
  IF perfil_tipo IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, perfil_tipo::app_role);
  END IF;
  
  RETURN new;
END;
$$;