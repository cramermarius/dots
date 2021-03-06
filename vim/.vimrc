"Vim configuration file -- Marius Cramer (marcramer@protonmail.com)
"vim-plug autoload
if empty(glob('~/.vim/autoload/plug.vim'))
	silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
				\ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
	autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

"Vim-Plug configuration–––––––––––––––––––––––––––––––––––––––––––––––––––––––––
call plug#begin('~/vim/plugged')
Plug 'lervag/vimtex'
	let g:tex_flavor='latexmk'
	let g:vimtex_view_method='zathura'
	let g:vimtex_quickfix_mode=0
Plug 'sirver/ultisnips'
	let g:UltiSnipsExpandTrigger = '<tab>'
	let g:UltiSnipsJumpForwardTrigger = '<tab>'
	let g:UltiSnipsJumpBackwardTrigger = '<s-tab>'
Plug 'vim-airline/vim-airline'
	let g:airline_powerline_fonts = 1
	if !exists('g:airline_symbols')
		let g:airline_symbols = {}
	endif
	let g:airline_left_sep = ''
	let g:airline_left_alt_sep = ''
	let g:airline_right_sep = ''
	let g:airline_right_alt_sep = ''
	let g:airline_symbols.readonly = ''
Plug 'vim-airline/vim-airline-themes'
	let g:airline_theme='ayu_mirage'
Plug 'arcticicestudio/nord-vim'
Plug 'junegunn/goyo.vim'
	let g:goyo_width = 105
	let g:goyo_height = 60
Plug 'junegunn/limelight.vim'
	let g:limelight_default_coefficient = 0.6
	let g:limelight_conceal_guifg = '#4c566a'
	let g:limelight_paragraph_span = 0
Plug 'airblade/vim-gitgutter'
Plug 'scrooloose/nerdtree'
	let NERDTreeShowHidden = 0
	let NERDTreeQuitOnOpen = 1
	let NERDTreeMinimalUI = 1
	let NERDTreeDirArrows = 1
Plug 'Xuyuanp/nerdtree-git-plugin'
Plug 'ryanoasis/vim-devicons'
Plug 'vim-scripts/vim-auto-save'
	let g:auto_save = 1 "enable on startup
	let g:auto_save_in_insert_mode = 0
Plug 'jiangmiao/auto-pairs'
Plug 'cramermarius/forest-nord-vim', { 'branch': 'develop' }
Plug 'KeitaNakamura/tex-conceal.vim', {'for': 'tex'}
	let g:tex_conceal='abdmg'
Plug 'tpope/vim-fugitive'
call plug#end()
"––––––––––––––––––––––––––––––––––––––––––––––––––––––––-––––––––––––––––––––––


"vim settings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
set tabstop=4
set noshowmode
set tw=90
set ignorecase
set conceallevel=2
set nocursorline
set nofoldenable
set relativenumber
set number
set encoding=UTF-8
set nospell
set spelllang=de,en_gb
syntax enable
set listchars=tab:\|\ "indentation lines
set list
set termguicolors
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Theme–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
colorscheme forest-nord
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Folding behaviour–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
augroup remember_folds
	autocmd!
	autocmd BufWinLeave ?* mkview | filetype detect
	autocmd BufWinEnter ?* silent loadview | filetype detect
augroup END
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function! ToggleConcealLevel()
    if &conceallevel == 0
        setlocal conceallevel=2
    else
        setlocal conceallevel=0
    endif
endfunction
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" NERDTree––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
" open NERDTree on default
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


"Goyo functions–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function! s:goyo_enter()
	se nu
	se rnu
	Limelight
endfunction

function! s:goyo_leave()
	se nu
	se rnu
	Limelight!
endfunction

autocmd! User GoyoEnter nested call <SID>goyo_enter()
autocmd! User GoyoLeave nested call <SID>goyo_leave()
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
autocmd FileType gitcommit exec 'au VimEnter * startinsert'

"Trailing whitespace highlighting-----------------------------------------------
highlight ExtraWhitespace ctermbg=blue guibg=#BF616A
match ExtraWhitespace /\s\+$/
autocmd BufWinEnter * match ExtraWhitespace /\s\+$/
autocmd InsertEnter * match ExtraWhitespace /\s\+\%#\@<!$/
autocmd InsertLeave * match ExtraWhitespace /\s\+$/
autocmd BufWinLeave * call clearmatches()

"Mappings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
noremap <C-y> :tabn<CR>
noremap <C-o> :Goyo<CR>
noremap <C-x> :NERDTreeToggle<CR>
nnoremap <C-i> :set hlsearch!<CR>
inoremap <C-f> <Esc>: silent exec '.!inkscape-figures create "'.getline('.').'" "'.b:vimtex.root.'/figures/"'<CR><CR>:w<CR>
nnoremap <C-f> : silent exec '!inkscape-figures edit "'.b:vimtex.root.'/figures/" > /dev/null 2>&1 &'<CR><CR>:redraw!<CR>
inoremap <Up> <Nop>
inoremap <Down> <Nop>
inoremap <Left> <Nop>
inoremap <Right> <Nop>
nnoremap <C-l> :call ToggleConcealLevel()<CR>

nmap <C-z> :set nonu norelativenumber <bar> :GitGutterDisable <bar> :se conceallevel=0<CR>
nmap <S-z> :set nu relativenumber <bar> :GitGutterEnable <bar> :se conceallevel=2<CR>
" au VimEnter * silent! !xmodmap -e 'clear Lock' -e 'keycode 0x37 = Escape'
" au VimLeave * silent! !xmodmap -e 'clear Lock' -e 'keycode 0x37 = Control_L'
" below: spellcheck correct last typo
inoremap <C-l> <c-g>u<Esc>[s1z=`]a<c-g>u
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
