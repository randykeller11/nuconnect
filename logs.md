Runtime Error


Error: useToast must be used within a ToastProvider

lib/hooks/use-toast.tsx (72:11) @ useToast


  70 |   const context = React.useContext(ToastContext)
  71 |   if (!context) {
> 72 |     throw new Error('useToast must be used within a ToastProvider')
     |           ^
  73 |   }
  74 |   return context
  75 | }
Call Stack
4

Show 1 ignore-listed frame(s)
useToast
lib/hooks/use-toast.tsx (72:11)
RoomPageContent
app/rooms/[id]/page.tsx (45:38)
RoomPage
app/rooms/[id]/page.tsx (386:7)