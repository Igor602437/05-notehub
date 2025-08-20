import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik'
import * as Yup from "yup"
import css from './NoteForm.module.css'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { NewNote } from '../../types/note';
import { createNote } from '../../services/noteService';

interface NoteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Text is too long"),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Make your choice')
    .required("Tag is required"),
});

export default function NoteForm({ onClose, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['myNotes'],
      });
      onClose();
      onSuccess();
    },
  })

  const handleSubmit = (
    values: NewNote,
    actions: FormikHelpers<NewNote>
  ) => {
    const newNote: NewNote = {
      title: values.title,
      content: values.content,
      tag: values.tag
    }
    mutation.mutate(newNote, {
      onSuccess: () => {
        actions.resetForm();
      }
    });
  }
  
  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}>
      
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage component='span' name="title" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              as="textarea"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage component='span' name="content" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" as="select" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage component='span' name="tag" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {mutation.isPending ? 'Creating new note' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
