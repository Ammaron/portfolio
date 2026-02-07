// i18n/translations/placement-test.ts

export interface PlacementTestTranslations {
  placementTest: {
    // Landing Page
    landing: {
      title: string;
      subtitle: string;
      description: string;
      whyTakeTest: string;
      benefits: string[];
      selectMode: string;
    };
    // Mode Cards
    modes: {
      quick: {
        title: string;
        badge: string;
        description: string;
        duration: string;
        skills: string;
        features: string[];
        cta: string;
      };
      personalized: {
        title: string;
        badge: string;
        description: string;
        duration: string;
        skills: string;
        features: string[];
        cta: string;
      };
      compare: {
        title: string;
        skillsCovered: string;
        reviewType: string;
        results: string;
        pauseResume: string;
        certificate: string;
        automated: string;
        manual: string;
        instant: string;
        adminReview: string;
        no: string;
        yes: string;
      };
    };
    // Test Interface
    test: {
      progress: string;
      question: string;
      of: string;
      timeRemaining: string;
      skill: string;
      level: string;
      submit: string;
      next: string;
      previous: string;
      finish: string;
      confirmFinish: string;
      confirmFinishMessage: string;
      cancel: string;
      // Question Types
      selectAnswer: string;
      trueOrFalse: string;
      trueOrFalseMulti: string;
      fillInBlank: string;
      matchItems: string;
      writeResponse: string;
      // Instructions
      readPassage: string;
      listenAudio: string;
      playAudio: string;
      pauseAudio: string;
      recordResponse: string;
      startRecording: string;
      stopRecording: string;
      reRecord: string;
      // Status
      answered: string;
      unanswered: string;
      loading: string;
      saving: string;
      saved: string;
      error: string;
      connectionLost: string;
      reconnecting: string;
    };
    // Quick Mode
    quick: {
      intro: {
        title: string;
        subtitle: string;
        instructions: string[];
        tips: string[];
        startButton: string;
        backButton: string;
      };
    };
    // Personalized Mode
    personalized: {
      intro: {
        title: string;
        subtitle: string;
        instructions: string[];
        registrationTitle: string;
      };
      registration: {
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        phoneOptional: string;
        consent: string;
        consentText: string;
        startButton: string;
      };
      pause: {
        title: string;
        message: string;
        sessionCode: string;
        copyCode: string;
        copied: string;
        resume: string;
        resumePlaceholder: string;
        resumeButton: string;
        continueButton: string;
      };
    };
    // Results Page
    results: {
      title: string;
      subtitle: string;
      congratulations: string;
      yourLevel: string;
      overallLevel: string;
      confidence: string;
      skillBreakdown: string;
      // Skill descriptions
      reading: string;
      listening: string;
      writing: string;
      speaking: string;
      // Level assessments
      strong: string;
      good: string;
      developing: string;
      // Pending review
      pendingReview: string;
      pendingMessage: string;
      checkBack: string;
      sessionCode: string;
      // Actions
      downloadCertificate: string;
      emailResults: string;
      tryAgain: string;
      takePersonalized: string;
      backToHome: string;
      // Certificate
      certificateTitle: string;
      certificateSubtitle: string;
      certificateReady: string;
      certificateCode: string;
      // Detailed feedback
      detailedFeedback: string;
      yourAnswer: string;
      expertScore: string;
      expertComment: string;
      expertFeedback: string;
      // Level descriptions
      levelDescriptions: {
        A1: string;
        A2: string;
        B1: string;
        B2: string;
        C1: string;
        C2: string;
      };
    };
    // Verify Page
    verify: {
      title: string;
      subtitle: string;
      enterCode: string;
      codePlaceholder: string;
      verifyButton: string;
      noResults: string;
      tryAgain: string;
    };
    // Admin
    admin: {
      dashboard: {
        title: string;
        subtitle: string;
        totalTests: string;
        completed: string;
        pendingReview: string;
        avgTime: string;
        levelDistribution: string;
        recentSubmissions: string;
        viewAll: string;
      };
      submissions: {
        title: string;
        filters: string;
        status: string;
        mode: string;
        dateRange: string;
        search: string;
        searchPlaceholder: string;
        noResults: string;
        columns: {
          student: string;
          mode: string;
          status: string;
          level: string;
          date: string;
          actions: string;
        };
        statuses: {
          in_progress: string;
          completed: string;
          pending_review: string;
          reviewed: string;
          expired: string;
        };
      };
      grading: {
        title: string;
        studentInfo: string;
        testDetails: string;
        responses: string;
        autoScored: string;
        manualReview: string;
        rubric: string;
        score: string;
        feedback: string;
        feedbackPlaceholder: string;
        adjustLevel: string;
        markComplete: string;
        saveProgress: string;
        completeAndIssue: string;
        certificateIssued: string;
        previewCertificate: string;
        certificateStatus: string;
      };
      questions: {
        title: string;
        addQuestion: string;
        importQuestions: string;
        columns: {
          code: string;
          skill: string;
          level: string;
          type: string;
          status: string;
          actions: string;
        };
        form: {
          questionCode: string;
          skill: string;
          level: string;
          type: string;
          questionText: string;
          questionTextEs: string;
          passageText: string;
          audioUrl: string;
          options: string;
          addOption: string;
          correctAnswer: string;
          maxPoints: string;
          difficulty: string;
          timeLimit: string;
          save: string;
          cancel: string;
        };
      };
      import: {
        title: string;
        instructions: string;
        dragDrop: string;
        selectFile: string;
        supportedFormats: string;
        preview: string;
        importing: string;
        success: string;
        errors: string;
      };
      settings: {
        title: string;
        questionsPerSkill: string;
        quickMode: string;
        personalizedMode: string;
        timeLimits: string;
        quickTimeLimit: string;
        personalizedTimeLimit: string;
        skillWeights: string;
        sessionExpiry: string;
        save: string;
        reset: string;
      };
    };
    // Common
    common: {
      minutes: string;
      hours: string;
      points: string;
      correct: string;
      incorrect: string;
      required: string;
      optional: string;
      loading: string;
      error: string;
      success: string;
      retry: string;
      close: string;
      back: string;
      continue: string;
    };
  };
}

export const placementTestTranslations: Record<'en' | 'es', PlacementTestTranslations> = {
  en: {
    placementTest: {
      landing: {
        title: 'English Placement Test',
        subtitle: 'Discover Your English Level',
        description: 'Take our adaptive placement test to accurately determine your CEFR level (A1-C2) and get personalized recommendations for your English learning journey.',
        whyTakeTest: 'Why Take This Test?',
        benefits: [
          'Get an accurate assessment of your current English level',
          'Receive personalized recommendations for improvement',
          'Understand your strengths and areas for development',
          'Get a certificate to verify your English proficiency'
        ],
        selectMode: 'Choose Your Test Mode'
      },
      modes: {
        quick: {
          title: 'Quick Assessment',
          badge: 'Fast & Free',
          description: 'Get a quick estimate of your English level in just 25 minutes. Perfect for a fast placement or to check your progress.',
          duration: '~25 minutes',
          skills: 'Reading & Listening',
          features: [
            '20 adaptive questions',
            'Instant results',
            'Automated scoring',
            'Basic certificate'
          ],
          cta: 'Start Quick Test'
        },
        personalized: {
          title: 'Personalized Assessment',
          badge: 'Comprehensive',
          description: 'Get a thorough evaluation of all four language skills with expert feedback and detailed recommendations.',
          duration: '~45-60 minutes',
          skills: 'All 4 Skills',
          features: [
            '40-50 adaptive questions',
            'Writing & Speaking included',
            'Expert review & feedback',
            'Detailed certificate',
            'Pause & resume anytime'
          ],
          cta: 'Start Full Test'
        },
        compare: {
          title: 'Compare Test Modes',
          skillsCovered: 'Skills Covered',
          reviewType: 'Review Type',
          results: 'Results',
          pauseResume: 'Pause/Resume',
          certificate: 'Certificate',
          automated: 'Automated',
          manual: 'Expert Review',
          instant: 'Instant',
          adminReview: '24-48 hours',
          no: 'No',
          yes: 'Yes'
        }
      },
      test: {
        progress: 'Progress',
        question: 'Question',
        of: 'of',
        timeRemaining: 'Time Remaining',
        skill: 'Skill',
        level: 'Level',
        submit: 'Submit Answer',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish Test',
        confirmFinish: 'Finish Test?',
        confirmFinishMessage: 'Are you sure you want to finish? You cannot change your answers after submitting.',
        cancel: 'Cancel',
        selectAnswer: 'Select the correct answer',
        trueOrFalse: 'Is this statement true or false?',
        trueOrFalseMulti: 'Decide if each statement is True or False',
        fillInBlank: 'Fill in the blank with the correct word or phrase',
        matchItems: 'Match the items on the left with the correct items on the right',
        writeResponse: 'Write your response in the space below',
        readPassage: 'Read the following passage carefully',
        listenAudio: 'Listen to the audio clip',
        playAudio: 'Play Audio',
        pauseAudio: 'Pause Audio',
        recordResponse: 'Record your spoken response',
        startRecording: 'Start Recording',
        stopRecording: 'Stop Recording',
        reRecord: 'Re-record',
        answered: 'Answered',
        unanswered: 'Unanswered',
        loading: 'Loading question...',
        saving: 'Saving...',
        saved: 'Saved',
        error: 'Error saving answer',
        connectionLost: 'Connection lost',
        reconnecting: 'Reconnecting...'
      },
      quick: {
        intro: {
          title: 'Quick Placement Test',
          subtitle: 'Get your English level in ~25 minutes',
          instructions: [
            'This test contains 20 questions covering Reading and Listening skills',
            'Questions adapt to your level - they get easier or harder based on your answers',
            'You cannot pause or go back once you start',
            'Make sure you have a stable internet connection',
            'Use headphones for the listening section'
          ],
          tips: [
            'Find a quiet place without distractions',
            'Read each question carefully before answering',
            "Don't spend too long on any single question",
            "If you're unsure, make your best guess and move on"
          ],
          startButton: 'Begin Test',
          backButton: 'Back to Selection'
        }
      },
      personalized: {
        intro: {
          title: 'Personalized Placement Test',
          subtitle: 'Comprehensive assessment with expert feedback',
          instructions: [
            'This test evaluates all 4 skills: Reading, Listening, Writing, and Speaking',
            'You can pause and resume the test using your session code',
            'Writing and Speaking sections require typed and recorded responses',
            'An expert will review your responses and provide personalized feedback',
            'Results will be available within 24-48 hours'
          ],
          registrationTitle: 'Register to Begin'
        },
        registration: {
          name: 'Full Name',
          namePlaceholder: 'Enter your full name',
          email: 'Email Address',
          emailPlaceholder: 'your.email@example.com',
          phone: 'Phone Number',
          phonePlaceholder: '+1 234 567 8900',
          phoneOptional: '(Optional)',
          consent: 'I agree to the terms',
          consentText: 'I consent to having my responses reviewed and stored for assessment purposes.',
          startButton: 'Start Assessment'
        },
        pause: {
          title: 'Pause Test',
          message: 'Your progress has been saved. Use this code to resume your test later:',
          sessionCode: 'Session Code',
          copyCode: 'Copy Code',
          copied: 'Copied!',
          resume: 'Resume a Previous Test',
          resumePlaceholder: 'Enter your session code (e.g., ABCD-1234)',
          resumeButton: 'Resume Test',
          continueButton: 'Continue Test'
        }
      },
      results: {
        title: 'Your Results',
        subtitle: 'English Placement Test Results',
        congratulations: 'Congratulations on completing the test!',
        yourLevel: 'Your English Level',
        overallLevel: 'Overall Level',
        confidence: 'Confidence',
        skillBreakdown: 'Skill Breakdown',
        reading: 'Reading',
        listening: 'Listening',
        writing: 'Writing',
        speaking: 'Speaking',
        strong: 'Strong',
        good: 'Good',
        developing: 'Developing',
        pendingReview: 'Pending Review',
        pendingMessage: 'Your writing and speaking responses are being reviewed by our experts. You will receive an email notification when your full results are ready.',
        checkBack: 'Check back in 24-48 hours or use your session code to view your results.',
        sessionCode: 'Your Session Code',
        downloadCertificate: 'Download Certificate',
        emailResults: 'Email Results',
        tryAgain: 'Take Test Again',
        takePersonalized: 'Take Full Assessment',
        backToHome: 'Back to Home',
        certificateTitle: 'Certificate of English Proficiency',
        certificateSubtitle: 'This certifies that the above-named individual has demonstrated English proficiency at the indicated CEFR level.',
        certificateReady: 'Certificate Ready',
        certificateCode: 'Certificate Code',
        detailedFeedback: 'Your Detailed Feedback',
        yourAnswer: 'Your Answer',
        expertScore: 'Expert Score',
        expertComment: 'Expert Comment',
        expertFeedback: 'Expert Feedback',
        levelDescriptions: {
          A1: 'Beginner - Can understand and use familiar everyday expressions and very basic phrases.',
          A2: 'Elementary - Can communicate in simple and routine tasks requiring direct exchange of information.',
          B1: 'Intermediate - Can deal with most situations likely to arise while traveling and describe experiences.',
          B2: 'Upper Intermediate - Can interact with a degree of fluency and spontaneity with native speakers.',
          C1: 'Advanced - Can express ideas fluently and spontaneously without obvious searching for expressions.',
          C2: 'Proficient - Can understand virtually everything heard or read and express themselves spontaneously.'
        }
      },
      verify: {
        title: 'View Your Results',
        subtitle: 'Enter your session code to access your test results',
        enterCode: 'Session Code',
        codePlaceholder: 'XXXX-XXXX',
        verifyButton: 'View Results',
        noResults: 'No results found for this code. Please check and try again.',
        tryAgain: 'Try Again'
      },
      admin: {
        dashboard: {
          title: 'Placement Test Dashboard',
          subtitle: 'Manage and review placement test submissions',
          totalTests: 'Total Tests',
          completed: 'Completed',
          pendingReview: 'Pending Review',
          avgTime: 'Avg. Time',
          levelDistribution: 'Level Distribution',
          recentSubmissions: 'Recent Submissions',
          viewAll: 'View All'
        },
        submissions: {
          title: 'All Submissions',
          filters: 'Filters',
          status: 'Status',
          mode: 'Mode',
          dateRange: 'Date Range',
          search: 'Search',
          searchPlaceholder: 'Search by name or email...',
          noResults: 'No submissions found',
          columns: {
            student: 'Student',
            mode: 'Mode',
            status: 'Status',
            level: 'Level',
            date: 'Date',
            actions: 'Actions'
          },
          statuses: {
            in_progress: 'In Progress',
            completed: 'Completed',
            pending_review: 'Pending Review',
            reviewed: 'Reviewed',
            expired: 'Expired'
          }
        },
        grading: {
          title: 'Review Submission',
          studentInfo: 'Student Information',
          testDetails: 'Test Details',
          responses: 'Responses',
          autoScored: 'Auto-Scored',
          manualReview: 'Manual Review Required',
          rubric: 'Grading Rubric',
          score: 'Score',
          feedback: 'Feedback',
          feedbackPlaceholder: 'Provide feedback for the student...',
          adjustLevel: 'Adjust Level',
          markComplete: 'Mark as Reviewed',
          saveProgress: 'Save Progress',
          completeAndIssue: 'Complete Review & Issue Certificate',
          certificateIssued: 'Certificate Issued',
          previewCertificate: 'Preview Certificate',
          certificateStatus: 'Certificate Status'
        },
        questions: {
          title: 'Question Bank',
          addQuestion: 'Add Question',
          importQuestions: 'Import Questions',
          columns: {
            code: 'Code',
            skill: 'Skill',
            level: 'Level',
            type: 'Type',
            status: 'Status',
            actions: 'Actions'
          },
          form: {
            questionCode: 'Question Code',
            skill: 'Skill',
            level: 'CEFR Level',
            type: 'Question Type',
            questionText: 'Question Text (English)',
            questionTextEs: 'Question Text (Spanish)',
            passageText: 'Passage Text',
            audioUrl: 'Audio URL',
            options: 'Answer Options',
            addOption: 'Add Option',
            correctAnswer: 'Correct Answer',
            maxPoints: 'Max Points',
            difficulty: 'Difficulty (0-1)',
            timeLimit: 'Time Limit (seconds)',
            save: 'Save Question',
            cancel: 'Cancel'
          }
        },
        import: {
          title: 'Import Questions',
          instructions: 'Upload an Excel file (.xlsx) with your question bank. The file should follow the standard template format.',
          dragDrop: 'Drag and drop your file here, or',
          selectFile: 'Select File',
          supportedFormats: 'Supported: .xlsx, .xls',
          preview: 'Preview',
          importing: 'Importing...',
          success: 'Successfully imported',
          errors: 'Errors'
        },
        settings: {
          title: 'Test Settings',
          questionsPerSkill: 'Questions Per Skill',
          quickMode: 'Quick Mode',
          personalizedMode: 'Personalized Mode',
          timeLimits: 'Time Limits',
          quickTimeLimit: 'Quick Mode (minutes)',
          personalizedTimeLimit: 'Personalized Mode (minutes)',
          skillWeights: 'Skill Weights for Overall Score',
          sessionExpiry: 'Session Expiry (hours)',
          save: 'Save Settings',
          reset: 'Reset to Defaults'
        }
      },
      common: {
        minutes: 'minutes',
        hours: 'hours',
        points: 'points',
        correct: 'Correct',
        incorrect: 'Incorrect',
        required: 'Required',
        optional: 'Optional',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success!',
        retry: 'Retry',
        close: 'Close',
        back: 'Back',
        continue: 'Continue'
      }
    }
  },
  es: {
    placementTest: {
      landing: {
        title: 'Prueba de Nivel de Inglés',
        subtitle: 'Descubre Tu Nivel de Inglés',
        description: 'Realiza nuestra prueba adaptativa para determinar con precisión tu nivel MCER (A1-C2) y recibe recomendaciones personalizadas para tu aprendizaje de inglés.',
        whyTakeTest: '¿Por Qué Hacer Esta Prueba?',
        benefits: [
          'Obtén una evaluación precisa de tu nivel actual de inglés',
          'Recibe recomendaciones personalizadas para mejorar',
          'Comprende tus fortalezas y áreas de desarrollo',
          'Obtén un certificado que verifica tu dominio del inglés'
        ],
        selectMode: 'Elige Tu Modo de Prueba'
      },
      modes: {
        quick: {
          title: 'Evaluación Rápida',
          badge: 'Rápida y Gratuita',
          description: 'Obtén una estimación rápida de tu nivel de inglés en solo 25 minutos. Perfecta para una clasificación rápida o para verificar tu progreso.',
          duration: '~25 minutos',
          skills: 'Lectura y Comprensión Auditiva',
          features: [
            '20 preguntas adaptativas',
            'Resultados instantáneos',
            'Puntuación automática',
            'Certificado básico'
          ],
          cta: 'Iniciar Prueba Rápida'
        },
        personalized: {
          title: 'Evaluación Personalizada',
          badge: 'Completa',
          description: 'Obtén una evaluación completa de las cuatro habilidades lingüísticas con retroalimentación experta y recomendaciones detalladas.',
          duration: '~45-60 minutos',
          skills: 'Las 4 Habilidades',
          features: [
            '40-50 preguntas adaptativas',
            'Escritura y expresión oral incluidas',
            'Revisión y retroalimentación de expertos',
            'Certificado detallado',
            'Pausar y reanudar cuando quieras'
          ],
          cta: 'Iniciar Prueba Completa'
        },
        compare: {
          title: 'Comparar Modos de Prueba',
          skillsCovered: 'Habilidades Evaluadas',
          reviewType: 'Tipo de Revisión',
          results: 'Resultados',
          pauseResume: 'Pausar/Reanudar',
          certificate: 'Certificado',
          automated: 'Automática',
          manual: 'Revisión de Expertos',
          instant: 'Instantáneos',
          adminReview: '24-48 horas',
          no: 'No',
          yes: 'Sí'
        }
      },
      test: {
        progress: 'Progreso',
        question: 'Pregunta',
        of: 'de',
        timeRemaining: 'Tiempo Restante',
        skill: 'Habilidad',
        level: 'Nivel',
        submit: 'Enviar Respuesta',
        next: 'Siguiente',
        previous: 'Anterior',
        finish: 'Finalizar Prueba',
        confirmFinish: '¿Finalizar Prueba?',
        confirmFinishMessage: '¿Estás seguro de que quieres finalizar? No podrás cambiar tus respuestas después de enviar.',
        cancel: 'Cancelar',
        selectAnswer: 'Selecciona la respuesta correcta',
        trueOrFalse: '¿Esta afirmación es verdadera o falsa?',
        trueOrFalseMulti: 'Decide si cada afirmación es Verdadera o Falsa',
        fillInBlank: 'Completa el espacio en blanco con la palabra o frase correcta',
        matchItems: 'Relaciona los elementos de la izquierda con los elementos correctos de la derecha',
        writeResponse: 'Escribe tu respuesta en el espacio de abajo',
        readPassage: 'Lee el siguiente pasaje cuidadosamente',
        listenAudio: 'Escucha el audio',
        playAudio: 'Reproducir Audio',
        pauseAudio: 'Pausar Audio',
        recordResponse: 'Graba tu respuesta hablada',
        startRecording: 'Iniciar Grabación',
        stopRecording: 'Detener Grabación',
        reRecord: 'Volver a Grabar',
        answered: 'Respondida',
        unanswered: 'Sin responder',
        loading: 'Cargando pregunta...',
        saving: 'Guardando...',
        saved: 'Guardado',
        error: 'Error al guardar respuesta',
        connectionLost: 'Conexión perdida',
        reconnecting: 'Reconectando...'
      },
      quick: {
        intro: {
          title: 'Prueba de Nivel Rápida',
          subtitle: 'Obtén tu nivel de inglés en ~25 minutos',
          instructions: [
            'Esta prueba contiene 20 preguntas que cubren las habilidades de Lectura y Comprensión Auditiva',
            'Las preguntas se adaptan a tu nivel - se vuelven más fáciles o difíciles según tus respuestas',
            'No puedes pausar ni retroceder una vez que empieces',
            'Asegúrate de tener una conexión a internet estable',
            'Usa auriculares para la sección de comprensión auditiva'
          ],
          tips: [
            'Encuentra un lugar tranquilo sin distracciones',
            'Lee cada pregunta cuidadosamente antes de responder',
            'No pases demasiado tiempo en una sola pregunta',
            'Si no estás seguro, haz tu mejor intento y continúa'
          ],
          startButton: 'Comenzar Prueba',
          backButton: 'Volver a Selección'
        }
      },
      personalized: {
        intro: {
          title: 'Prueba de Nivel Personalizada',
          subtitle: 'Evaluación completa con retroalimentación de expertos',
          instructions: [
            'Esta prueba evalúa las 4 habilidades: Lectura, Comprensión Auditiva, Escritura y Expresión Oral',
            'Puedes pausar y reanudar la prueba usando tu código de sesión',
            'Las secciones de Escritura y Expresión Oral requieren respuestas escritas y grabadas',
            'Un experto revisará tus respuestas y proporcionará retroalimentación personalizada',
            'Los resultados estarán disponibles en 24-48 horas'
          ],
          registrationTitle: 'Regístrate para Comenzar'
        },
        registration: {
          name: 'Nombre Completo',
          namePlaceholder: 'Ingresa tu nombre completo',
          email: 'Correo Electrónico',
          emailPlaceholder: 'tu.correo@ejemplo.com',
          phone: 'Número de Teléfono',
          phonePlaceholder: '+1 234 567 8900',
          phoneOptional: '(Opcional)',
          consent: 'Acepto los términos',
          consentText: 'Consiento que mis respuestas sean revisadas y almacenadas para fines de evaluación.',
          startButton: 'Iniciar Evaluación'
        },
        pause: {
          title: 'Pausar Prueba',
          message: 'Tu progreso ha sido guardado. Usa este código para reanudar tu prueba más tarde:',
          sessionCode: 'Código de Sesión',
          copyCode: 'Copiar Código',
          copied: '¡Copiado!',
          resume: 'Reanudar una Prueba Anterior',
          resumePlaceholder: 'Ingresa tu código de sesión (ej. ABCD-1234)',
          resumeButton: 'Reanudar Prueba',
          continueButton: 'Continuar Prueba'
        }
      },
      results: {
        title: 'Tus Resultados',
        subtitle: 'Resultados de la Prueba de Nivel de Inglés',
        congratulations: '¡Felicitaciones por completar la prueba!',
        yourLevel: 'Tu Nivel de Inglés',
        overallLevel: 'Nivel General',
        confidence: 'Confianza',
        skillBreakdown: 'Desglose por Habilidades',
        reading: 'Lectura',
        listening: 'Comprensión Auditiva',
        writing: 'Escritura',
        speaking: 'Expresión Oral',
        strong: 'Fuerte',
        good: 'Bueno',
        developing: 'En Desarrollo',
        pendingReview: 'Revisión Pendiente',
        pendingMessage: 'Tus respuestas de escritura y expresión oral están siendo revisadas por nuestros expertos. Recibirás una notificación por correo electrónico cuando tus resultados completos estén listos.',
        checkBack: 'Vuelve en 24-48 horas o usa tu código de sesión para ver tus resultados.',
        sessionCode: 'Tu Código de Sesión',
        downloadCertificate: 'Descargar Certificado',
        emailResults: 'Enviar Resultados por Correo',
        tryAgain: 'Repetir Prueba',
        takePersonalized: 'Realizar Evaluación Completa',
        backToHome: 'Volver al Inicio',
        certificateTitle: 'Certificado de Competencia en Inglés',
        certificateSubtitle: 'Este certifica que la persona mencionada ha demostrado competencia en inglés al nivel MCER indicado.',
        certificateReady: 'Certificado Listo',
        certificateCode: 'Código de Certificado',
        detailedFeedback: 'Tu Retroalimentación Detallada',
        yourAnswer: 'Tu Respuesta',
        expertScore: 'Puntuación del Experto',
        expertComment: 'Comentario del Experto',
        expertFeedback: 'Retroalimentación del Experto',
        levelDescriptions: {
          A1: 'Principiante - Puede comprender y usar expresiones cotidianas familiares y frases muy básicas.',
          A2: 'Elemental - Puede comunicarse en tareas simples y rutinarias que requieren intercambio directo de información.',
          B1: 'Intermedio - Puede desenvolverse en la mayoría de situaciones que puedan surgir durante un viaje y describir experiencias.',
          B2: 'Intermedio Alto - Puede interactuar con cierto grado de fluidez y espontaneidad con hablantes nativos.',
          C1: 'Avanzado - Puede expresar ideas con fluidez y espontaneidad sin buscar expresiones de forma obvia.',
          C2: 'Competente - Puede comprender prácticamente todo lo que oye o lee y expresarse espontáneamente.'
        }
      },
      verify: {
        title: 'Ver Tus Resultados',
        subtitle: 'Ingresa tu código de sesión para acceder a los resultados de tu prueba',
        enterCode: 'Código de Sesión',
        codePlaceholder: 'XXXX-XXXX',
        verifyButton: 'Ver Resultados',
        noResults: 'No se encontraron resultados para este código. Por favor verifica e intenta de nuevo.',
        tryAgain: 'Intentar de Nuevo'
      },
      admin: {
        dashboard: {
          title: 'Panel de Pruebas de Nivel',
          subtitle: 'Gestiona y revisa las pruebas de nivel enviadas',
          totalTests: 'Total de Pruebas',
          completed: 'Completadas',
          pendingReview: 'Revisión Pendiente',
          avgTime: 'Tiempo Promedio',
          levelDistribution: 'Distribución de Niveles',
          recentSubmissions: 'Envíos Recientes',
          viewAll: 'Ver Todos'
        },
        submissions: {
          title: 'Todos los Envíos',
          filters: 'Filtros',
          status: 'Estado',
          mode: 'Modo',
          dateRange: 'Rango de Fechas',
          search: 'Buscar',
          searchPlaceholder: 'Buscar por nombre o correo...',
          noResults: 'No se encontraron envíos',
          columns: {
            student: 'Estudiante',
            mode: 'Modo',
            status: 'Estado',
            level: 'Nivel',
            date: 'Fecha',
            actions: 'Acciones'
          },
          statuses: {
            in_progress: 'En Progreso',
            completed: 'Completado',
            pending_review: 'Revisión Pendiente',
            reviewed: 'Revisado',
            expired: 'Expirado'
          }
        },
        grading: {
          title: 'Revisar Envío',
          studentInfo: 'Información del Estudiante',
          testDetails: 'Detalles de la Prueba',
          responses: 'Respuestas',
          autoScored: 'Puntuación Automática',
          manualReview: 'Revisión Manual Requerida',
          rubric: 'Rúbrica de Calificación',
          score: 'Puntuación',
          feedback: 'Retroalimentación',
          feedbackPlaceholder: 'Proporciona retroalimentación para el estudiante...',
          adjustLevel: 'Ajustar Nivel',
          markComplete: 'Marcar como Revisado',
          saveProgress: 'Guardar Progreso',
          completeAndIssue: 'Completar Revisión y Emitir Certificado',
          certificateIssued: 'Certificado Emitido',
          previewCertificate: 'Vista Previa del Certificado',
          certificateStatus: 'Estado del Certificado'
        },
        questions: {
          title: 'Banco de Preguntas',
          addQuestion: 'Agregar Pregunta',
          importQuestions: 'Importar Preguntas',
          columns: {
            code: 'Código',
            skill: 'Habilidad',
            level: 'Nivel',
            type: 'Tipo',
            status: 'Estado',
            actions: 'Acciones'
          },
          form: {
            questionCode: 'Código de Pregunta',
            skill: 'Habilidad',
            level: 'Nivel MCER',
            type: 'Tipo de Pregunta',
            questionText: 'Texto de la Pregunta (Inglés)',
            questionTextEs: 'Texto de la Pregunta (Español)',
            passageText: 'Texto del Pasaje',
            audioUrl: 'URL del Audio',
            options: 'Opciones de Respuesta',
            addOption: 'Agregar Opción',
            correctAnswer: 'Respuesta Correcta',
            maxPoints: 'Puntos Máximos',
            difficulty: 'Dificultad (0-1)',
            timeLimit: 'Límite de Tiempo (segundos)',
            save: 'Guardar Pregunta',
            cancel: 'Cancelar'
          }
        },
        import: {
          title: 'Importar Preguntas',
          instructions: 'Sube un archivo Excel (.xlsx) con tu banco de preguntas. El archivo debe seguir el formato de plantilla estándar.',
          dragDrop: 'Arrastra y suelta tu archivo aquí, o',
          selectFile: 'Seleccionar Archivo',
          supportedFormats: 'Soportado: .xlsx, .xls',
          preview: 'Vista Previa',
          importing: 'Importando...',
          success: 'Importado exitosamente',
          errors: 'Errores'
        },
        settings: {
          title: 'Configuración de Pruebas',
          questionsPerSkill: 'Preguntas por Habilidad',
          quickMode: 'Modo Rápido',
          personalizedMode: 'Modo Personalizado',
          timeLimits: 'Límites de Tiempo',
          quickTimeLimit: 'Modo Rápido (minutos)',
          personalizedTimeLimit: 'Modo Personalizado (minutos)',
          skillWeights: 'Pesos de Habilidades para Puntuación General',
          sessionExpiry: 'Expiración de Sesión (horas)',
          save: 'Guardar Configuración',
          reset: 'Restablecer Valores'
        }
      },
      common: {
        minutes: 'minutos',
        hours: 'horas',
        points: 'puntos',
        correct: 'Correcto',
        incorrect: 'Incorrecto',
        required: 'Requerido',
        optional: 'Opcional',
        loading: 'Cargando...',
        error: 'Ocurrió un error',
        success: '¡Éxito!',
        retry: 'Reintentar',
        close: 'Cerrar',
        back: 'Atrás',
        continue: 'Continuar'
      }
    }
  }
};
