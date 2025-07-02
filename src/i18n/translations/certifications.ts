// i18n/translations/certifications.ts
export interface CertificationsTranslations {
  certifications: {
    title: string;
    subtitle: string;
    description: string;
    hero: {
      title: string;
      description: string;
      verifyTitle: string;
      verifyPlaceholder: string;
      verifyButton: string;
    };
    value: {
      title: string;
      subtitle: string;
      international: {
        title: string;
        description: string;
      };
      quality: {
        title: string;
        description: string;
      };
      security: {
        title: string;
        description: string;
      };
      impact: {
        title: string;
        description: string;
      };
    };
    types: {
      title: string;
      subtitle: string;
      cefr: {
        title: string;
        description: string;
        features: string[];
      };
      business: {
        title: string;
        description: string;
        features: string[];
      };
      custom: {
        title: string;
        description: string;
        features: string[];
      };
    };
    verification: {
      title: string;
      subtitle: string;
      howItWorks: string;
      step1: string;
      step2: string;
      step3: string;
      form: {
        codeLabel: string;
        verificationLabel: string;
        codePlaceholder: string;
        verificationPlaceholder: string;
        codeHelper: string;
        verificationHelper: string;
        verifyButton: string;
        clearButton: string;
        verifying: string;
      };
      results: {
        verified: string;
        failed: string;
        holder: string;
        completionDate: string;
        issueDate: string;
        instructor: string;
        grade: string;
        hours: string;
        expiration: string;
        code: string;
        verifiedBy: string;
        verifiedOn: string;
        errors: {
          notFound: string;
          reasons: string;
          incorrectCode: string;
          revoked: string;
          notIssued: string;
        };
      };
      help: {
        title: string;
        troubleshooting: string;
        tips: string[];
        aboutCerts: string;
        features: string[];
      };
    };
    cta: {
      title: string;
      description: string;
      viewPrograms: string;
      contactUs: string;
    };
  };
}

export const certificationsTranslations: Record<'en' | 'es', CertificationsTranslations> = {
  en: {
    certifications: {
      title: 'Professional Certifications',
      subtitle: 'Internationally Recognized Credentials',
      description: 'Validate your English language proficiency and professional communication skills with our MBA-designed, internationally recognized certification programs.',
      
      hero: {
        title: 'Professional Certifications',
        description: 'Validate your English language proficiency and professional communication skills with our MBA-designed, internationally recognized certification programs.',
        verifyTitle: 'Verify a Certificate',
        verifyPlaceholder: 'Enter certificate code (e.g., ENG-B2-2024-001)',
        verifyButton: 'Verify Certificate'
      },
      
      value: {
        title: 'Why Our Certifications Matter',
        subtitle: 'Our certifications are backed by MBA-level educational design, international standards compliance, and proven business outcomes.',
        international: {
          title: 'International Recognition',
          description: 'CEFR-aligned certifications recognized by universities and employers worldwide'
        },
        quality: {
          title: 'MBA-Designed Quality',
          description: 'Curriculum designed with business education expertise and professional outcomes focus'
        },
        security: {
          title: 'Verified Authenticity',
          description: 'Secure verification system with unique codes and tamper-proof digital records'
        },
        impact: {
          title: 'Professional Impact',
          description: 'Proven track record of career advancement and professional opportunities for graduates'
        }
      },
      
      types: {
        title: 'Certification Programs',
        subtitle: 'Choose from our range of professional certification programs designed for career advancement and international recognition.',
        cefr: {
          title: 'CEFR English Certifications',
          description: 'Internationally recognized Common European Framework of Reference for Languages (CEFR) certifications.',
          features: [
            'Globally recognized standard',
            'Employer-trusted credentials',
            'University admission qualified',
            'Clear skill progression pathway'
          ]
        },
        business: {
          title: 'Professional Business Communication',
          description: 'Specialized certification for business English and professional communication skills.',
          features: [
            'Industry-specific terminology',
            'Executive communication skills',
            'Presentation and negotiation',
            'MBA-designed curriculum'
          ]
        },
        custom: {
          title: 'Corporate Programs',
          description: 'Customized certification programs designed for specific organizational needs.',
          features: [
            'Company-specific content',
            'Industry alignment',
            'Scalable training',
            'ROI measurement'
          ]
        }
      },
      
      verification: {
        title: 'Certificate Verification',
        subtitle: 'Secure verification system for all issued certificates.',
        howItWorks: 'How Verification Works',
        step1: 'Enter the certificate code',
        step2: 'System validates against secure database',
        step3: 'View complete certification details',
        form: {
          codeLabel: 'Certificate Code',
          verificationLabel: 'Verification Code',
          codePlaceholder: 'ENG-B2-2024-001',
          verificationPlaceholder: '123456',
          codeHelper: 'Code found on your official certificate',
          verificationHelper: 'Optional: Additional security code',
          verifyButton: 'Verify Now',
          clearButton: 'Clear',
          verifying: 'Verifying...'
        },
        results: {
          verified: 'Certificate Verified',
          failed: 'Verification Failed',
          holder: 'Certificate Holder',
          completionDate: 'Completion Date',
          issueDate: 'Issue Date',
          instructor: 'Instructor',
          grade: 'Grade',
          hours: 'Hours Completed',
          expiration: 'Expiration Date',
          code: 'Certificate Code',
          verifiedBy: 'Certificate verified as authentic.',
          verifiedOn: 'Verification completed on',
          errors: {
            notFound: 'Code could not be verified.',
            reasons: 'Possible reasons:',
            incorrectCode: 'Incorrect code entered',
            revoked: 'Certificate has been revoked',
            notIssued: 'Code has not been issued'
          }
        },
        help: {
          title: 'Need Help?',
          troubleshooting: 'Having trouble verifying?',
          tips: [
            'Ensure you\'re entering the complete certificate code',
            'Check for any typos or extra characters',
            'Verification codes are case-sensitive',
            'Contact us if you continue having issues'
          ],
          aboutCerts: 'About our certificates',
          features: [
            'All certificates are digitally secured',
            'CEFR-aligned international standards',
            'Recognized by employers worldwide',
            'Professional MBA-designed curriculum'
          ]
        }
      },
      
      cta: {
        title: 'Ready to Earn Your Certification?',
        description: 'Join hundreds of professionals who have advanced their careers with our internationally recognized certifications. Start your journey to professional English mastery today.',
        viewPrograms: 'View Programs',
        contactUs: 'Contact Us'
      }
    }
  },
  es: {
    certifications: {
      title: 'Certificaciones Profesionales',
      subtitle: 'Credenciales Reconocidas Internacionalmente',
      description: 'Valida tu competencia en inglés con programas Maestria en Administracion de Negocios reconocidos internacionalmente.',
      hero: {
        title: 'Certificaciones Profesionales',
        description: 'Programas de certificación Maestria en Administracion de Negocios reconocidos internacionalmente.',
        verifyTitle: 'Verificar Certificado',
        verifyPlaceholder: 'Código del certificado (ej: ENG-B2-2024-001)',
        verifyButton: 'Verificar Certificado'
      },
      value: {
        title: 'Por Qué Importan Nuestras Certificaciones',
        subtitle: 'Respaldadas por diseño Maestria en Administracion de Negocios y estándares internacionales.',
        international: {
          title: 'Reconocimiento Internacional',
          description: 'Certificaciones MCER reconocidas mundialmente'
        },
        quality: {
          title: 'Calidad Maestria en Administracion de Negocios',
          description: 'Diseño con experiencia empresarial'
        },
        security: {
          title: 'Autenticidad Verificada',
          description: 'Sistema seguro con códigos únicos'
        },
        impact: {
          title: 'Impacto Profesional',
          description: 'Historial de avance profesional'
        }
      },
      types: {
        title: 'Programas de Certificación',
        subtitle: 'Programas para avance y reconocimiento internacional.',
        cefr: {
          title: 'Certificaciones MCER',
          description: 'Marco Común Europeo reconocido internacionalmente.',
          features: ['Estándar global', 'Confiable para empleadores', 'Admisión universitaria', 'Progresión clara']
        },
        business: {
          title: 'Comunicación Empresarial',
          description: 'Certificación especializada en inglés empresarial.',
          features: ['Terminología específica', 'Comunicación ejecutiva', 'Presentaciones', 'Currículo Maestria en Administracion de Negocios']
        },
        custom: {
          title: 'Programas Corporativos',
          description: 'Programas adaptados para organizaciones.',
          features: ['Contenido específico', 'Alineación industrial', 'Entrenamiento escalable', 'Medición ROI']
        }
      },
      verification: {
        title: 'Verificación de Certificados',
        subtitle: 'Sistema de verificación seguro.',
        howItWorks: 'Cómo Funciona',
        step1: 'Ingresa el código del certificado',
        step2: 'Sistema valida contra base de datos',
        step3: 'Ve detalles completos de certificación',
        form: {
          codeLabel: 'Código del Certificado',
          verificationLabel: 'Código de Verificación',
          codePlaceholder: 'ENG-B2-2024-001',
          verificationPlaceholder: '123456',
          codeHelper: 'Código encontrado en certificado oficial',
          verificationHelper: 'Opcional: Código de seguridad adicional',
          verifyButton: 'Verificar Ahora',
          clearButton: 'Limpiar',
          verifying: 'Verificando...'
        },
        results: {
          verified: 'Certificado Verificado',
          failed: 'Verificación Fallida',
          holder: 'Portador',
          completionDate: 'Fecha de Finalización',
          issueDate: 'Fecha de Emisión',
          instructor: 'Instructor',
          grade: 'Calificación',
          hours: 'Horas Completadas',
          expiration: 'Fecha de Expiración',
          code: 'Código del Certificado',
          verifiedBy: 'Certificado verificado como auténtico.',
          verifiedOn: 'Verificación completada el',
          errors: {
            notFound: 'Código no pudo ser verificado.',
            reasons: 'Posibles razones:',
            incorrectCode: 'Código incorrecto',
            revoked: 'Certificado revocado',
            notIssued: 'Código no emitido'
          }
        },
        help: {
          title: '¿Necesitas Ayuda?',
          troubleshooting: '¿Problemas verificando?',
          tips: [
            'Asegúrate de ingresar el código completo',
            'Verifica errores tipográficos',
            'Los códigos son sensibles a mayúsculas',
            'Contáctanos si continúas teniendo problemas'
          ],
          aboutCerts: 'Sobre nuestros certificados',
          features: [
            'Todos los certificados están asegurados digitalmente',
            'Estándares internacionales MCER',
            'Reconocidos por empleadores mundialmente',
            'Currículo profesional diseñado por Maestria en Administracion de Negocios'
          ]
        }
      },
      cta: {
        title: '¿Listo para Obtener tu Certificación?',
        description: 'Únete a cientos de profesionales que han avanzado sus carreras con nuestras certificaciones reconocidas internacionalmente.',
        viewPrograms: 'Ver Programas',
        contactUs: 'Contáctanos'
      }
    }
  }
};
