from .student_router import router as student_router
from .parent_router  import router as parent_router
from .school_router  import router as school_router
from .admin_router   import router as admin_router
from .auth_router    import router as auth_router

__all__ = [
    "student_router", "parent_router",
    "school_router",  "admin_router",
    "auth_router"
]