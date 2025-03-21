
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userService, RegisterParams } from "@/services/userService";

const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").nonempty("El nombre es obligatorio"),
  apellidos: z.string().optional(),
  username: z.string().min(3, "El username debe tener al menos 3 caracteres").nonempty("El nombre de usuario es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").nonempty("La contraseña es obligatoria"),
  confirmPassword: z.string().nonempty("Confirmar la contraseña es obligatorio"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function checkUsernameAvailability(username: string) {
    if (username.length < 3) return;
    
    setIsChecking(true);
    try {
      const isAvailable = await userService.checkUsername(username);
      if (!isAvailable) {
        form.setError("username", { 
          type: "manual", 
          message: "Este nombre de usuario ya existe" 
        });
      } else {
        form.clearErrors("username");
      }
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setIsChecking(false);
    }
  }

  async function onSubmit(formData: RegisterFormValues) {
    setIsSubmitting(true);
    try {
      const userData: RegisterParams = {
        nombre: formData.nombre,
        apellidos: formData.apellidos || "",
        username: formData.username,
        password: formData.password
      };
      
      const result = await userService.register(userData);
      
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
      });
      
      form.reset();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al registrarse",
        description: error.message || "Ha ocurrido un error durante el registro.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-slate-900">
      <h2 className="text-2xl font-bold text-center mb-6">Crear una cuenta</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tus apellidos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de usuario <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Elige un nombre de usuario" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      checkUsernameAvailability(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  {isChecking ? "Verificando disponibilidad..." : ""}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Crea una contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar contraseña <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirma tu contraseña" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="text-red-500">*</span> Campos obligatorios
      </div>
    </div>
  );
}
